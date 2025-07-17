import * as fs from "fs";
import * as path from "path";
import { visit } from "unist-util-visit";

/** @type {import("unified").Plugin<[], import("mdast").Root, import("vfile").VFile>} */
const importCode = replaceCodeTransform;
export default importCode;

/**
 * @param {unknown[]} options
 * @return {import("unified").Transformer<import("mdast").Root, import("mdast").Root>}
 */
function replaceCodeTransform(...options) {
  return (tree, file) => {
    visit(tree, "code", (code) => processCodeNode(code, file));
  };
}

/**
 * @param {import("mdast").Code} code
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
    const parts = meta.split(/\s+/);
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
