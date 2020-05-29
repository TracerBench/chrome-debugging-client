# chrome-debugging-client

[![Build Status](https://travis-ci.org/tracerbench/chrome-debugging-client.svg?branch=master)](https://travis-ci.org/tracerbench/chrome-debugging-client)
[![npm](https://img.shields.io/npm/v/chrome-debugging-client.svg)](https://www.npmjs.com/package/chrome-debugging-client)
[![install size](https://packagephobia.now.sh/badge?p=chrome-debugging-client)](https://packagephobia.now.sh/result?p=chrome-debugging-client)

An async/await friendly Chrome debugging client with TypeScript support,
designed with automation in mind.

## Table of Contents

-   [Features](#features)

-   [Examples](#examples)

    -   [Print URL as PDF](#print-url-as-pdf)
    -   [Node Debugging](#node-debugging)

## Features

-   Promise API for async/await (most debugger commands are meant to be sequential).
-   TypeScript support and uses "devtools-protocol" types, allowing you to pick a protocol version.
-   Launches Chrome with a new temp user data folder so Chrome launches an isolated instance.
    (regardless if you already have Chrome open).
-   Opens Chrome with a pipe message transport to the browser connection and supports
    attaching flattened session connections to targets.
-   Supports cancellation in a way that avoids unhandled rejections, and allows you to add combine
    additional cancellation concerns.
-   Supports seeing protocol debug messages with `DEBUG=chrome-debugging-client:*`
-   Use with race-cancellation library to add timeouts or other cancellation concerns to tasks
    using the connection.
-   The library was designed to be careful about not floating promises (promises are
    chained immediately after being created, combining concurrent promises with all
    or race), this avoids unhandled rejections.

## Examples

### Print URL as PDF

```js file=examples/printToPDF.js
#!/usr/bin/env node
const { writeFileSync } = require("fs");
const { spawnChrome } = require("chrome-debugging-client");

/**
 * Print a url to a PDF file.
 * @param url {string}
 * @param file {string}
 */
async function printToPDF(url, file) {
  const chrome = spawnChrome({ headless: true });
  try {
    const browser = chrome.connection;

    // we create with a target of about:blank so that we can
    // setup Page events before navigating to url
    const { targetId } = await browser.send("Target.createTarget", {
      url: "about:blank",
    });

    const page = await browser.attachToTarget(targetId);
    // enable events for Page domain
    await page.send("Page.enable");

    // concurrently wait until load and navigate
    await Promise.all([
      page.until("Page.loadEventFired"),
      page.send("Page.navigate", { url }),
    ]);

    const { data } = await page.send("Page.printToPDF");

    writeFileSync(file, data, "base64");

    // attempt graceful close
    await chrome.close();
  } finally {
    // kill process if hasn't exited
    await chrome.dispose();
  }

  console.log(`${url} written to ${file}`);
}

if (process.argv.length < 4) {
  console.log(`usage: printToPDF.js url file`);
  console.log(
    `example: printToPDF.js https://en.wikipedia.org/wiki/Binomial_coefficient Binomial_coefficient.pdf`,
  );
  process.exit(1);
}

printToPDF(process.argv[2], process.argv[3]).catch((err) => {
  console.log("print failed %o", err);
});

```

### Node Debugging

```js file=examples/nodeDebug.js
#!/usr/bin/env node
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
    await connection.send("Debugger.setBreakpoint", {
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

main().catch((err) => {
  console.log("print failed %o", err);
});

```
