import { ProtocolCodegen } from "./index";
import * as ts from "typescript";
import * as fs from "fs";

let protocol = JSON.parse(fs.readFileSync("test/protocol.json", "utf8"));
let codegen = new ProtocolCodegen();
codegen.clientModule = "../lib/debugging-protocol-client-factory";
let code = codegen.generate(protocol);
fs.writeFileSync("test/domains.ts", code);

let configObject = JSON.parse(fs.readFileSync("test/tsconfig.json", "utf8"));
let config = ts.parseJsonConfigFileContent(configObject, ts.sys, fs.realpathSync("test"));
let program = ts.createProgram(config.fileNames, config.options);
program.emit();

require("./test/index");
