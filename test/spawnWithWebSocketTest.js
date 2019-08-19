// @ts-check
const { spawnWithWebSocket } = require("chrome-debugging-client");

QUnit.module("spawnWithWebSocket", () => {
  QUnit.test("run script with break on start", async assert => {
    // start node requesting it break on start at debug port that
    // is available
    const node = await spawnWithWebSocket(process.execPath, [
      "--inspect-brk=0",
      "-e",
      `const obj = {
          hello: "world",
        };
        debugger;
        console.log("end");`,
    ]);
    const { connection } = node;
    try {
      // we requested Node to break on start, so we runIfWaitingForDebugger
      // and wait for it to break at the start of our script
      await Promise.all([
        connection.until("Debugger.paused"),
        connection.send("Debugger.enable"),
        connection.send("Runtime.enable"),
        connection.send("Runtime.runIfWaitingForDebugger"),
      ]);
      // right now we are paused at the start of the script

      // resume until debugger statement hit
      const [debuggerStatement] = await Promise.all([
        connection.until("Debugger.paused"),
        connection.send("Debugger.resume"),
      ]);

      // get the call frame of the debugger statement
      const [callFrame] = debuggerStatement.callFrames;
      const { callFrameId } = callFrame;

      // eval obj at the debugger call frame
      const { result } = await connection.send("Debugger.evaluateOnCallFrame", {
        callFrameId,
        expression: "obj",
        returnByValue: true,
      });

      assert.equal(result.type, "object");
      assert.deepEqual(result.value, { hello: "world" });

      // resume and wait for execution to be done
      await Promise.all([
        connection.until("Runtime.executionContextDestroyed"),
        connection.send("Debugger.resume"),
      ]);

      // Node is still alive here and waiting for the debugger to disconnect
      // when we close the websocket after resuming
      // Node should exit on its own
      node.close();

      await node.waitForExit();
    } finally {
      await node.dispose();
    }
  });
});
