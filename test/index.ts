import * as tape from "tape";
import { createSession } from "../index";
import { HeapProfiler } from "../protocol/tot";

tape("test REST API", async (t) => {
  createSession(async (session) => {
    const browser = await session.spawnBrowser("exact", {
      additionalArguments: ['--headless'],
      executablePath: process.env.CHROME_BIN,
      windowSize: { width: 320, height: 640 },
    });
    const apiClient = session.createAPIClient("localhost", browser.remoteDebuggingPort);
    const version = await apiClient.version();
    t.assert(version["Protocol-Version"], "has Protocol-Version");
    t.assert(version["User-Agent"], "has User-Agent");
    const tab = await apiClient.newTab();
    t.assert(tab, "newTab returned a tab");
    t.assert(tab.id, "tab has id");
    await apiClient.activateTab(tab.id);
    const tabs = await apiClient.listTabs();
    t.assert(tabs, "listTabs returned tabs");
    t.assert(Array.isArray(tabs), "tabs isArray");
    t.assert(tabs.find((other) => other.id === tab.id), "tabs from listTabs contains tab from newTab");
    await apiClient.closeTab(tab.id);
  }).then(() => t.end(), (err) => err ? t.error(err) : t.fail());
});

tape("test debugging protocol domains", async (t) => {
  createSession(async (session) => {
    const browser = await session.spawnBrowser("exact", {
      additionalArguments: ['--headless'],
      executablePath: process.env.CHROME_BIN,
    });
    const apiClient = session.createAPIClient("localhost", browser.remoteDebuggingPort);
    const tab = await apiClient.newTab("about:blank");
    t.assert(tab.webSocketDebuggerUrl, "has web socket url");
    const debuggingClient = await session.openDebuggingProtocol(tab.webSocketDebuggerUrl!);
    const heapProfiler = new HeapProfiler(debuggingClient);
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
    const data = JSON.parse(buffer);
    t.assert(data.snapshot.meta, "has snapshot");
  }).then(() => t.end(), (err) => err ? t.error(err) : t.fail());
});
