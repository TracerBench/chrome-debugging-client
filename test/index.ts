import test from "ava";
import { createSession } from "../index";
import { HeapProfiler, Page, Target } from "../protocol/tot";

const additionalArguments = [
  "--headless",
  "--disable-gpu",
  "--hide-scrollbars",
  "--mute-audio",
  "--disable-logging",
];

test("test REST API", async t => {
  await createSession(async session => {
    const browser = await session.spawnBrowser({
      additionalArguments,
      stdio: "ignore",
      windowSize: { width: 320, height: 640 },
    });
    const apiClient = session.createAPIClient(
      "localhost",
      browser.remoteDebuggingPort,
    );
    const version = await apiClient.version();
    t.truthy(version["Protocol-Version"], "has Protocol-Version");
    t.truthy(version["User-Agent"], "has User-Agent");
    const tab = await apiClient.newTab();
    t.truthy(tab, "newTab returned a tab");
    t.truthy(tab.id, "tab has id");
    await apiClient.activateTab(tab.id);
    const tabs = await apiClient.listTabs();
    t.truthy(tabs, "listTabs returned tabs");
    t.true(Array.isArray(tabs), "tabs isArray");
    t.truthy(
      tabs.find(other => other.id === tab.id),
      "tabs from listTabs contains tab from newTab",
    );
    await apiClient.closeTab(tab.id);
  });
});

test("test debugging protocol domains", async t => {
  await createSession(async session => {
    const browser = await session.spawnBrowser({
      additionalArguments,
      stdio: "ignore",
    });
    const apiClient = session.createAPIClient(
      "localhost",
      browser.remoteDebuggingPort,
    );
    const tab = await apiClient.newTab("about:blank");
    t.truthy(tab.webSocketDebuggerUrl, "has web socket url");
    const debuggingClient = await session.openDebuggingProtocol(
      tab.webSocketDebuggerUrl!,
    );
    const heapProfiler = new HeapProfiler(debuggingClient);
    let buffer = "";
    await heapProfiler.enable();
    heapProfiler.addHeapSnapshotChunk = params => {
      buffer += params.chunk;
    };
    await heapProfiler.takeHeapSnapshot({ reportProgress: false });
    await heapProfiler.disable();
    t.true(buffer.length > 0, "received chunks");
    const data = JSON.parse(buffer);
    t.truthy(data.snapshot.meta, "has snapshot");
  });
});

test("test browser protocol", async t => {
  await createSession(async session => {
    const browser = await session.spawnBrowser({
      additionalArguments,
      stdio: "ignore",
    });

    const browserClient = await session.openDebuggingProtocol(
      browser.webSocketDebuggerUrl!,
    );

    const targetDomain = new Target(browserClient);
    const { browserContextId } = await targetDomain.createBrowserContext();
    const { targetId } = await targetDomain.createTarget({
      browserContextId,
      url: "about:blank",
    });
    const targets = await targetDomain.getTargets();
    t.truthy(
      targets.targetInfos.find(
        info =>
          info.targetId === targetId &&
          info.browserContextId === browserContextId,
      ),
      "has opened target",
    );

    const targetClient = await session.attachToTarget(browserClient, targetId);
    const page = new Page(targetClient);

    const frameTree = await page.getFrameTree();

    t.truthy(frameTree.frameTree.frame, "has target has frame tree");

    await targetClient.close();

    await targetDomain.closeTarget({ targetId });

    await browserClient.send("Browser.close");
  });
});
