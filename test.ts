import { createSession } from "./index";

createSession(async (session) => {
  let browserType;
  let resolverOptions;
  if (process.env.CHROME_BIN) {
    browserType = "exact";
    resolverOptions = {
      executablePath: process.env.CHROME_BIN
    };
  } else {
    browserType = "canary";
  }
  let browser = await session.spawn(browserType, resolverOptions);
  let client = session.createAPIClient("localhost", browser.remoteDebuggingPort);
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
  process.exit(1);
});
