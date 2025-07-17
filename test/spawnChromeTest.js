// @ts-check
const { spawnChrome } = require("chrome-debugging-client");

QUnit.module("spawnChrome", () => {
  QUnit.test(
    "connect to browser, create and attach to page target",
    async (assert) => {
      const chrome = spawnChrome({
        headless: true,
      });
      try {
        const browser = chrome.connection;

        browser.on("error", (err) => {
          assert.ok(false, `browser error ${err.stack ?? ""}`);
        });

        const browserVersion = await browser.send("Browser.getVersion");

        assert.ok(browserVersion.protocolVersion);
        assert.ok(browserVersion.product);
        assert.ok(browserVersion.userAgent);
        assert.ok(browserVersion.jsVersion);

        await browser.send("Security.setIgnoreCertificateErrors", {
          ignore: true,
        });

        const { targetId } = await browser.send("Target.createTarget", {
          url: "about:blank",
        });

        await browser.send("Target.activateTarget", { targetId });

        const page = await browser.attachToTarget(targetId);

        assert.equal(page.targetId, targetId);
        assert.ok(page.sessionId);
        assert.ok(page.targetInfo.type, "page");
        assert.ok(page.targetInfo.url, "about:blank");

        page.on("error", (err) => {
          assert.ok(false, `target connection error ${err.stack ?? ""}`);
        });

        let buffer = "";
        await page.send("HeapProfiler.enable");
        page.on("HeapProfiler.addHeapSnapshotChunk", (params) => {
          buffer += params.chunk;
        });

        await page.send("HeapProfiler.takeHeapSnapshot", {
          reportProgress: false,
        });

        assert.ok(buffer.length > 0, "received chunks");

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = JSON.parse(buffer);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        assert.ok(data.snapshot.meta, "has snapshot");

        await browser.send("Target.closeTarget", { targetId });

        await chrome.close();

        assert.ok(chrome.hasExited());
      } finally {
        await chrome.dispose();
      }
    },
  );

  QUnit.test("spawn chrome at bad path", async (assert) => {
    const chrome = spawnChrome({
      chromeExecutable: "bad/path/to/chrome",
      headless: true,
    });
    try {
      const browser = chrome.connection;

      try {
        await browser.send("Browser.getVersion");
        assert.ok(false, "should not get here");
      } catch (e) {
        assert.equal(
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          typeof e == "object" && e !== null && "message" in e && e.message,
          "process exited early: spawn bad/path/to/chrome ENOENT",
        );
      }

      assert.ok(chrome.hasExited());
    } finally {
      await chrome.dispose();
    }
  });
});
