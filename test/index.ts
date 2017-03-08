import { HeapProfiler } from "./domains";
import { createSession } from "../index";
import * as tape from "tape";

tape("test REST API", async (t) => {
  createSession(async (session) => {
    let browser = await session.spawnBrowser("exact", {
      executablePath: process.env.CHROME_BIN,
      windowSize: { width: 320, height: 640 },
      additionalArguments: ['--js-flags="--future"']
    });
    let apiClient = session.createAPIClient("localhost", browser.remoteDebuggingPort);
    let version = await apiClient.version();
    t.assert(version["Protocol-Version"], "has Protocol-Version");
    t.assert(version["User-Agent"], "has User-Agent");
    let tab = await apiClient.newTab();
    t.assert(tab, "newTab returned a tab");
    t.assert(tab.id, "tab has id");
    await apiClient.activateTab(tab.id);
    let tabs = await apiClient.listTabs();
    t.assert(tabs, "listTabs returned tabs");
    t.assert(Array.isArray(tabs), "tabs isArray");
    t.assert(tabs.find(other => other.id === tab.id), "tabs from listTabs contains tab from newTab");
    await apiClient.closeTab(tab.id);
  }).then(() => t.end(), err => err ? t.error(err) : t.fail());
});

[{
  HeapProfiler: HeapProfiler,
  name: "typescript"
}, {
  HeapProfiler: require("./untyped-domains").HeapProfiler,
  name: "js"
}].forEach((context: {
  name: string,
  HeapProfiler: typeof HeapProfiler
}) => {
  tape("test debugging protocol " + context.name, async (t) => {
    createSession(async (session) => {
      let browser = await session.spawnBrowser("exact", {
          executablePath: process.env.CHROME_BIN
      });
      let apiClient = session.createAPIClient("localhost", browser.remoteDebuggingPort);
      let tab = await apiClient.newTab("about:blank");
      let debuggingClient = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl);
      let heapProfiler = new context.HeapProfiler(debuggingClient);
      let buffer = "";
      await heapProfiler.enable();
      heapProfiler.addHeapSnapshotChunk = (params) => {
          buffer += params.chunk;
      };
      heapProfiler.reportHeapSnapshotProgress = (params) => {
          t.comment(params.done / params.total + "");
      };
      await heapProfiler.takeHeapSnapshot({ reportProgress: false });
      await heapProfiler.disable();
      t.assert(buffer.length > 0, "received chunks");
      let data = JSON.parse(buffer);
      t.assert(data.snapshot.meta, "has snapshot");
    }).then(() => t.end(), err => err ? t.error(err) : t.fail());
  });
})
