# chrome-debugging-client

[![Build Status](https://travis-ci.org/tracerbench/chrome-debugging-client.svg?branch=master)](https://travis-ci.org/tracerbench/chrome-debugging-client)
[![npm](https://img.shields.io/npm/v/chrome-debugging-client.svg)](https://www.npmjs.com/package/chrome-debugging-client)
[![install size](https://packagephobia.now.sh/badge?p=chrome-debugging-client)](https://packagephobia.now.sh/result?p=chrome-debugging-client)

An async/await friendly Chrome debugging client with TypeScript support,
designed with automation in mind.

## Features

* Promise API for async/await (most debugger commands are meant to be sequential).
* TypeScript support and uses "devtools-protocol" types, allowing you to pick a protocol version.
* Launches Chrome with a new temp user data folder so Chrome launches an isolated instance.
  (regardless if you already have Chrome open).
* Opens Chrome with a pipe message transport to the browser connection and supports
  attaching flattened session connections to targets.
* Supports cancellation in a way that avoids unhandled rejections, and allows you to add combine
  additional cancellation concerns.
* Supports seeing protocol debug messages with `DEBUG=chrome-debugging-client`
* Use with race-cancellation library to add timeouts or other cancellation concerns to tasks
  using the connection.
* The library was designed to be careful about not floating promises (promises are
  chained immediately after being created, combining concurrent promises with all
  or race), this avoids unhandled rejections.

## Examples

### Spawn Chrome And Take Heap Snapshot

```js
const { spawnChrome } = require("chrome-debugging-client");
const { writeFileSync } = require("fs");

main();

async function main() {
  const chrome = spawnChrome();
  try {
    const browser = chrome.connection;

    browser.on("error", err => {
      // underlying connection error or error dispatching events.
      console.error(`connection error ${err.stack}`);
    });

    const { targetId } = await browser.send("Target.createTarget", {
      url: "about:blank",
    });

    await browser.send("Target.activateTarget", { targetId });

    const page = await browser.attachToTarget(targetId);

    let buffer = "";
    await page.send("HeapProfiler.enable");
    page.on("HeapProfiler.addHeapSnapshotChunk", params => {
      buffer += params.chunk;
    });

    await page.send("HeapProfiler.takeHeapSnapshot", {
      reportProgress: false,
    });

    writeFileSync("heapsnapshot.json", buffer);

    await browser.send("Target.closeTarget", { targetId });

    // graceful browser shutdown
    await chrome.close();
  } finally {
    await chrome.dispose();
  }
}
```

### Debugging Node

```js
const { spawnWithWebSocket } = require("chrome-debugging-client");

main();

async function main() {
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
    const { result } = await connection.send(
      "Debugger.evaluateOnCallFrame",
      {
        callFrameId,
        expression: "obj",
        returnByValue: true,
      },
    );

    console.log(result.value); //= { hello: "world" }

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
}
```
