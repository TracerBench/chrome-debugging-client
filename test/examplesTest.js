const execa = require("execa");
const path = require("path");
const tmp = require("tmp");

QUnit.module("examples", () => {
  QUnit.test("nodeDebug.js", async assert => {
    const expected = `paused reason: Break on start
set breakpoint on line 3
resume and wait for next paused event
paused at line 3
evaluate \`obj\`
{"hello":"world"}
resume and wait for execution context to be destroyed
console.log: [{"type":"string","value":"end"}]
close websocket
wait for exit
node exited`;
    const stdout = await runExample("nodeDebug.js");
    assert.equal(stdout, expected);
  });

  QUnit.test("printToPDF.js", async assert => {
    const dir = tmp.dirSync({ unsafeCleanup: true });
    try {
      const outPath = path.resolve(dir.name, `blank.pdf`);
      const expected = `about:blank written to ${outPath}`;
      const stdout = await runExample("printToPDF.js", "about:blank", outPath);
      assert.equal(stdout, expected);
    } finally {
      dir.removeCallback();
    }
  });
});

/**
 * @param {string} script
 * @param {...string} args
 */
async function runExample(script, ...args) {
  const { stdout } = await execa(process.execPath, [
    path.resolve(__dirname, "../examples", script),
    ...args,
  ]);
  return stdout;
}
