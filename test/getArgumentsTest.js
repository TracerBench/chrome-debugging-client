const { getArguments } = require("@tracerbench/spawn-chrome");

QUnit.module("getArguments", () => {
  QUnit.test("merges disable-features and enable-features", assert => {
    assert.deepEqual(
      getArguments("/user-data-dir", {
        disableDefaultArguments: true
      }),
      ["--remote-debugging-pipe", "--user-data-dir=/user-data-dir"]
    );
  });

  QUnit.test("merges disable-features", assert => {
    assert.deepEqual(
      getArguments("/user-data-dir", {
        disableDefaultArguments: true,
        additionalArguments: [
          "--disable-features=TranslationUI",
          "--disable-features=NetworkPrediction"
        ]
      }),
      [
        "--remote-debugging-pipe",
        "--user-data-dir=/user-data-dir",
        "--disable-features=TranslationUI,NetworkPrediction"
      ]
    );
  });

  QUnit.test("merges enabled-features", assert => {
    assert.deepEqual(
      getArguments("/user-data-dir", {
        disableDefaultArguments: true,
        additionalArguments: [
          "--enable-features=TranslationUI",
          "--enable-features=NetworkPrediction"
        ]
      }),
      [
        "--remote-debugging-pipe",
        "--user-data-dir=/user-data-dir",
        "--enable-features=TranslationUI,NetworkPrediction"
      ]
    );
  });
});
