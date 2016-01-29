import * as devtools from "./index";
import * as assert from "assert";

async function testHTTPClient() {
  let client = new devtools.HTTPClient();
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

  let debugClient = new devtools.WebSocketClient(tab.webSocketDebuggerUrl);

  debugClient.verbose = true;

  await debugClient.send("HeapProfiler.enable", {});

  let buffer = "";

  debugClient.on("HeapProfiler.addHeapSnapshotChunk", (evt: {chunk: string}) => {
    buffer += evt.chunk;
  });

  await debugClient.send("HeapProfiler.takeHeapSnapshot", {});

  let data = JSON.parse(buffer);

  assert(data.snapshot.meta, "has snapshot meta");

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