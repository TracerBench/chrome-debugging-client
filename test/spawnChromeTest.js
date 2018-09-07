// @ts-check
const { spawnChrome } = require("chrome-debugging-client");

QUnit.module("spawnChrome", () => {
  QUnit.test(
    "connect to browser, create and attach to page target",
    async assert => {
      const chrome = spawnChrome();
      try {
        const browser = chrome.connection;

        browser.on("error", err => {
          assert.ok(false, `browser error ${err.stack}`);
        });

        const { targetId } = await browser.send("Target.createTarget", {
          url: "about:blank",
        });

        await browser.send("Target.activateTarget", { targetId });

        const page = browser.connection(
          await browser.send("Target.attachToTarget", {
            targetId,
            flatten: true,
          }),
        );

        assert.ok(page, "session present");

        if (page === undefined) {
          return;
        }

        page.on("error", err => {
          assert.ok(false, `target connection error ${err.stack}`);
        });

        let buffer = "";
        await page.send("HeapProfiler.enable");
        page.on("HeapProfiler.addHeapSnapshotChunk", params => {
          buffer += params.chunk;
        });

        await page.send("HeapProfiler.takeHeapSnapshot", {
          reportProgress: false,
        });

        assert.ok(buffer.length > 0, "received chunks");
        const data = JSON.parse(buffer);
        assert.ok(data.snapshot.meta, "has snapshot");

        await browser.send("Target.closeTarget", { targetId });

        await browser.send("Browser.close");

        await chrome.waitForExit();
      } finally {
        await chrome.dispose();
      }
    },
  );
});
