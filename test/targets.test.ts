import test from "ava";
import { createSession } from "../index";
import { Page, Target } from "../protocol/tot";

test("test browser protocol", async t => {
  await createSession(async session => {
    const browser = await session.spawnBrowser({
      additionalArguments: [
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--mute-audio",
        "--disable-logging",
      ],
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
