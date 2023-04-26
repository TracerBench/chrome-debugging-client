#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const unified = require("unified");
const vfile = require("vfile");

const importCode = require("./import-code");

void main();

async function main() {
  const { default: parse } = await import("remark-parse");
  const { default: stringify } = await import("remark-stringify");
  const { default: toc } = await import("remark-toc");
  const processor = unified()
    .use(parse)
    .use(toc)
    .use(importCode)
    .use(stringify);

  let readme = readReadme(path.resolve(__dirname, "../README.md"));

  readme = await processor.process(readme);

  writeReadme(
    path.resolve(__dirname, "../chrome-debugging-client/README.md"),
    readme,
  );
}

/**
 * @param {string} path
 */
function readReadme(path) {
  const contents = fs.readFileSync(path, "utf8");
  return vfile({
    contents,
    path,
  });
}

/**
 * @param {string} path
 * @param {import("vfile").VFile} file
 */
function writeReadme(path, file) {
  const contents = file.toString("utf8");
  if (file.path) {
    // the above tranforms update the input
    // so we can write back out the input
    fs.writeFileSync(file.path, contents);
  }
  fs.writeFileSync(path, contents);
}
