import test from "ava";
import { createSession } from "../index";

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
