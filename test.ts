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
  let browser = await session.spawnBrowser(browserType, resolverOptions);
  let apiClient = session.createAPIClient("localhost", browser.remoteDebuggingPort);
  let version = await apiClient.version();
  console.log(JSON.stringify(version, null, 2));
  let tabs = await apiClient.listTabs();
  let tab = tabs[0];
  await apiClient.activateTab(tab.id);
  let debuggingClient = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl);
  await debuggingClient.send("HeapProfiler.enable", {});
  let buffer = "";
  debuggingClient.on("HeapProfiler.addHeapSnapshotChunk", (evt) => {
    buffer += evt.chunk;
  });
  await debuggingClient.send("HeapProfiler.takeHeapSnapshot", {});
  return JSON.parse(buffer);
}).then((data) => {
  console.log(data.snapshot.meta);
}).catch((err) => {
  console.error(err);
  process.exit(1);
});
