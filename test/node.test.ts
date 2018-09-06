import test from "ava";
import * as execa from "execa";
import { createInterface } from "readline";
import { createSession } from "../index";
import { Debugger, Runtime } from "../protocol/v8";

test("connect to node websocket", async t => {
  t.plan(3);

  const child = disableNdb(
    () =>
      execa("node", ["--inspect-brk=0", "test/fixtures/node-debug.js"], {
        buffer: false,
        stdio: ["ignore", "ignore", "pipe"],
      } as any), // types missing buffer: boolean
  );

  const debugPromise = new Promise<string>(resolve => {
    // the websocket url is output on stderr
    const readline = createInterface({
      crlfDelay: Infinity,
      input: child.stderr,
    });

    readline.once("line", line => {
      const match = /Debugger listening on (ws:.*)$/.exec(line);
      if (match) {
        resolve(match[1]);
      }
    });
  }).then(wsUrl =>
    createSession(async session => {
      const client = await session.openDebuggingProtocol(wsUrl);

      const runtime = new Runtime(client);
      const debug = new Debugger(client);

      // we need to send Debugger.enable before Runtime.runIfWaitingForDebugger
      // in order to receive the first break event but its promise will not resolve
      // until runIfWaitingForDebugger is sent, so we send all of the commands concurrently
      // then wait for them all.
      const [pauseOnStart] = await Promise.all([
        new Promise<Debugger.PausedParameters>(resolve => {
          debug.paused = evt => resolve(evt);
        }),
        debug.enable(),
        runtime.enable(),
        runtime.runIfWaitingForDebugger(),
      ]);

      t.is(pauseOnStart.reason, "Break on start");

      const [debuggerPause] = await Promise.all([
        new Promise<Debugger.PausedParameters>(resolve => {
          debug.paused = evt => {
            resolve(evt);
          };
        }),
        debug.resume(),
      ]);

      const { result } = await debug.evaluateOnCallFrame({
        callFrameId: debuggerPause.callFrames[0].callFrameId,
        expression: "obj",
        returnByValue: true,
      });

      t.deepEqual(result.value, { hello: "world" });

      const [consoleMessage] = await Promise.all([
        new Promise<Runtime.ConsoleAPICalledParameters>(resolve => {
          runtime.consoleAPICalled = evt => resolve(evt);
        }),
        debug.resume(),
      ]);

      t.deepEqual(consoleMessage.args, [
        {
          type: "string",
          value: "end",
        },
      ]);
    }),
  );

  // exec a promise is for the lifetime of the promise
  // if the process exits or errors before finish we'll end
  // the test
  await Promise.race([child, debugPromise]);
});

function disableNdb<T>(callback: () => T) {
  const NODE_OPTIONS = process.env.NODE_OPTIONS;
  process.env.NODE_OPTIONS = "";
  try {
    return callback();
  } finally {
    process.env.NODE_OPTIONS = NODE_OPTIONS;
  }
}
