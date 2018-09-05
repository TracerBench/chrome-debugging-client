import test from "ava";
import { createSession } from "../index";
import { HeapProfiler } from "../protocol/tot";

const additionalArguments = [
  "--headless",
  "--disable-gpu",
  "--hide-scrollbars",
  "--mute-audio",
  "--disable-logging",
];

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
