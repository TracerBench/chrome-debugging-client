chrome-debugging-client
=======================
[![Build Status](https://travis-ci.org/krisselden/chrome-debugging-client.svg?branch=master)](https://travis-ci.org/krisselden/chrome-debugging-client)

Example:

```js
import { createSession } from "chrome-debugging-client";

createSession(async (session) => {
  let process = await session.spawn("canary", {
    windowSize: { width: 640, height: 320 },
    additionalArguments: ["--js-flags='--future'"]
  });
  let client = session.createAPIClient("localhost", process.remoteDebuggingPort);
  let version = await client.version();
  console.log(JSON.stringify(version, null, 2));
  let tabs = await client.listTabs();
  let tab = tabs[0];
  await client.activateTab(tab.id);
  let debugging = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl);
  await debugging.send("HeapProfiler.enable", {});
  let buffer = "";
  debugging.on("HeapProfiler.addHeapSnapshotChunk", (evt) => {
    buffer += evt.chunk;
  });
  await debugging.send("HeapProfiler.takeHeapSnapshot", {});
  return JSON.parse(buffer);
}).then((data) => {
  console.log(data.snapshot.meta);
}).catch((err) => {
  console.error(err);
});
```
