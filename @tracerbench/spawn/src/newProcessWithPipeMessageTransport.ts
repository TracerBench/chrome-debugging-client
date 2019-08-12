import debug = require("debug");

import { ProcessWithPipeMessageTransport } from "../types";

import createPipeMessageTransport from "./newPipeMessageTransport";
import newProcess from "./newProcess";

const debugCallback = debug("@tracerbench/spawn");

export default function newProcessWithPipeMessageTransport(
  child: import("execa").ExecaChildProcess,
): ProcessWithPipeMessageTransport {
  const process = newProcess(child);
  const [, , , writeStream, readStream] = streamsForPipe(child);
  return Object.assign(process, {
    attach: createPipeMessageTransport((onRead, onReadEnd, onClose) => {
      child.on("error", onClose);
      child.on("exit", onClose);

      readStream.on("data", onRead);
      readStream.on("end", () => {
        debugCallback("read pipe end");
        onReadEnd();
      });
      readStream.on("error", error => {
        debugCallback("read pipe error %O", error);
      });

      writeStream.on("close", () => {
        debugCallback("write pipe close");
        onClose();
      });
      writeStream.on("error", (error: Error | NodeJS.ErrnoException) => {
        debugCallback("write pipe error %O", error);
        // writes while the other side is closing can cause EPIPE
        // just wait for close to actually happen and ignore it.
        if (error && "code" in error && error.code === "EPIPE") {
          return;
        }
        onClose(error);
      });

      return [data => writeStream.write(data), () => writeStream.end()];
    }),
  });
}

function streamsForPipe(child: import("execa").ExecaChildProcess) {
  const stdio: unknown[] = child.stdio;
  if (stdio.length === 5) {
    return stdio as [
      NodeJS.WritableStream,
      NodeJS.ReadableStream,
      NodeJS.ReadableStream,
      NodeJS.WritableStream,
      NodeJS.ReadableStream,
    ];
  }
  throw new Error("expected process to have 5 stdio streams");
}
