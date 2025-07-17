#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { fileURLToPath } from "url";
import { VFile } from "vfile";

import importCode from "./import-code/index.js";

void main();

async function main() {
  const toc = await import("remark-toc");
  const processor = unified()
    .use(remarkParse)
    .use(toc.default)
    .use(importCode)
    .use(remarkStringify);

  const dirname = path.dirname(fileURLToPath(import.meta.url));

  let readme = readReadme(path.resolve(dirname, "../README.md"));

  readme = await processor.process(readme);

  writeReadme(
    path.resolve(dirname, "../chrome-debugging-client/README.md"),
    readme,
  );
}

/**
 * @param {string} path
 */
function readReadme(path) {
  const contents = fs.readFileSync(path, "utf8");
  return new VFile({ value: contents, path });
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
