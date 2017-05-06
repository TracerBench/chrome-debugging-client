import * as fs from "fs";
import * as ts from "typescript";
import { ProtocolCodegen } from "./index";

const PROTOCOL = JSON.parse(fs.readFileSync("test/protocol.json", "utf8"));

function testProtocolGenTypescript(protocol: any) {
  const codegen = new ProtocolCodegen({
    clientModuleName: "../lib/types",
    typescript: true,
  });
  const code = codegen.generate(protocol);
  fs.writeFileSync("test/domains.ts", code);

  const configObject = JSON.parse(fs.readFileSync("test/tsconfig.json", "utf8"));
  const config = ts.parseJsonConfigFileContent(configObject, ts.sys, fs.realpathSync("test"));
  const program = ts.createProgram(config.fileNames, config.options);
  program.emit();
}

function testProtocolGenJS(protocol: any) {
  const codegen = new ProtocolCodegen({
    typescript: false,
  });
  const code = codegen.generate(protocol);
  fs.writeFileSync("dist/test/untyped-domains.js", code);
}

testProtocolGenTypescript(PROTOCOL);
testProtocolGenJS(PROTOCOL);

/* tslint:disable:no-var-requires */
require("./test/index");
