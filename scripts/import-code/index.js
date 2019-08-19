const fs = require("fs");
const path = require("path");
const { split } = require("shell-split");
const visit = require("unist-util-visit");

/** @type {import("unified").Plugin} */
const importCode = () => replaceCodeTransform;

module.exports = importCode;

/**
 * @param {import("unist").Node} tree
 * @param {import("vfile").VFile} file
 */
function replaceCodeTransform(tree, file) {
  visit(tree, "code", code => processCodeNode(code, file));
  return tree;
}

/**
 * @param {import("unist").Node} code
 * @param {import("vfile").VFile} file
 */
function processCodeNode(code, file) {
  const { meta } = code;
  if (typeof meta === "string") {
    const value = parseCodeMeta(meta, file);
    if (value) {
      code.value = value;
    }
  }
}

/**
 * @param {string} meta
 * @param {import("vfile").VFile} file
 */
function parseCodeMeta(meta, file) {
  if (meta) {
    const parts = split(meta);
    for (const part of parts) {
      const [key, value] = part.split("=", 2);
      if (key === "file") {
        let codePath = value;
        const dirname = file.dirname;
        if (dirname) {
          codePath = path.resolve(dirname, codePath);
        }
        return fs.readFileSync(codePath, "utf8");
      }
    }
  }
}
