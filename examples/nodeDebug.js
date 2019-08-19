// @ts-check
const { spawnWithWebSocket } = require("chrome-debugging-client");

async function main() {
  const script = `const obj = {
    hello: "world",
  };
  console.log("end");
  `;

  // start node requesting it break on start at debug port that
  // is available
  const node = await spawnWithWebSocket(process.execPath, [
    // node will pick an available port and wait for debugger
    "--inspect-brk=0",
    "-e",
    script,
  ]);

  async function doDebugging() {
    const { connection } = node;

    // Setup console api handler
    connection.on("Runtime.consoleAPICalled", ({ type, args }) => {
      console.log(`console.${type}: ${JSON.stringify(args)}`);
    });

    // We requested Node to break on start, so we runIfWaitingForDebugger
    // and wait for it to break at the start of our script.
    // These commands must be sent concurrently with
    // the pause event setup.
    const [
      {
        callFrames: [
          {
            location: { scriptId },
          },
        ],
        reason,
      },
    ] = await Promise.all([
      connection.until("Debugger.paused"),
      connection.send("Debugger.enable"),
      connection.send("Runtime.enable"),
      connection.send("Runtime.runIfWaitingForDebugger"),
    ]);
    // Right now we are paused at the start of the script
    console.log(`paused reason: ${reason}`); //= paused: Break on start
    console.log(`set breakpoint on line 3`);
    connection.send("Debugger.setBreakpoint", {
      location: {
        lineNumber: 3,
        scriptId,
      },
    });

    console.log("resume and wait for next paused event");
    const [breakpoint] = await Promise.all([
      connection.until("Debugger.paused"),
      connection.send("Debugger.resume"),
    ]);
    const {
      callFrames: [{ location, callFrameId }],
    } = breakpoint;
    console.log(`paused at line ${location.lineNumber}`);

    console.log("evaluate `obj`");
    const { result } = await connection.send("Debugger.evaluateOnCallFrame", {
      callFrameId,
      expression: "obj",
      returnByValue: true,
    });
    console.log(JSON.stringify(result.value)); //= {"hello":"world"}

    console.log("resume and wait for execution context to be destroyed");
    await Promise.all([
      connection.until("Runtime.executionContextDestroyed"),
      connection.send("Debugger.resume"),
    ]);
  }

  try {
    await doDebugging();

    // Node is still alive here and waiting for the debugger to disconnect
    console.log("close websocket");
    node.close();

    // Node should exit on its own after the websocket closes
    console.log("wait for exit");
    await node.waitForExit();

    console.log("node exited");
  } finally {
    // kill process if still alive
    await node.dispose();
  }
}

main();
