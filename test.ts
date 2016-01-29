import { DevToolsHTTPClient, RemoteDebuggingClient } from "./index";
import * as assert from "assert";

async function testHTTPClient() {
  let client = new DevToolsHTTPClient();
  let version = await client.version();
  assert(version, "has version");

  let tab = await client.new();
  assert(tab.id, "has id");
  let tabs = await client.list();
  assert(Array.isArray(tabs), "tabs is an array");
  assert(tabs.some((other) => other.id === tab.id), "contains the new tab");
  await client.activate(tab.id);
  await client.close(tab.id);

  let url = "file://" + __dirname + "/../test.html";

  tab = await client.new(url);

  let debugClient = new RemoteDebuggingClient(tab.webSocketDebuggerUrl);

  await debugClient.sendCommand("DOM.enable", {});

  let document: any = await debugClient.sendCommand("DOM.getDocument", {});
  let updated = new Promise((resolve) => {
    debugClient.on("DOM.documentUpdated", resolve);
  });

  let res = await debugClient.sendCommand("DOM.requestChildNodes", {
    nodeId: document.root.nodeId,
    depth: 20
  });

  await updated;

  document = await debugClient.sendCommand("DOM.getDocument", {});

  try {
    await client.close("bad-id");
    assert.fail();
  } catch (e) {
    assert.equal(e.message, "No such target id: bad-id")
    assert.equal(e.statusCode, 404);
  }
}

testHTTPClient().then(() => {
  console.log("success");
  process.exit(0)
}).catch((err) => {
  console.error(String(err));
  process.exit(1);
});