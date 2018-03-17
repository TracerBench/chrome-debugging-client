import * as fs from "fs";
import * as https from "https";
import { ProtocolCodegen } from "../codegen";

generate(
  "raw.githubusercontent.com",
  "/ChromeDevTools/debugger-protocol-viewer/master/_data/1-2/protocol.json",
  "protocol/1-2.ts",
);

generate(
  "raw.githubusercontent.com",
  "/ChromeDevTools/debugger-protocol-viewer/master/_data/tot/protocol.json",
  "protocol/tot.ts",
);

generate(
  "raw.githubusercontent.com",
  "/ChromeDevTools/debugger-protocol-viewer/master/_data/v8/protocol.json",
  "protocol/v8.ts",
);

/* tslint:disable:no-console */
function generate(host: string, path: string, file: string) {
  console.log(`fetching ${path}`);
  https.get({ host, path }, res => {
    const chunks: Buffer[] = [];
    res.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });
    res.on("end", () => {
      const protocol = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      const codegen = new ProtocolCodegen({
        clientModuleName: "../lib/types",
      });
      console.log(`generating ${file}`);
      const code = codegen.generate(protocol);
      fs.writeFileSync(file, code);
    });
  });
}
