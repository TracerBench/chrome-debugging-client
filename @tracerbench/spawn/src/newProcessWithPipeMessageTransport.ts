import { ProcessWithPipeMessageTransport } from "../types";

import createPipeMessageTransport from "./newPipeMessageTransport";
import newProcess from "./newProcess";

export default function newProcessWithPipeMessageTransport(
  child: import("execa").ExecaChildProcess,
): ProcessWithPipeMessageTransport {
  const process = newProcess(child);
  const [, , , writeStream, readStream] = streamsForPipe(child);
  return Object.assign(process, {
    attach: createPipeMessageTransport(writeStream, readStream),
  });
}

function streamsForPipe(child: import("execa").ExecaChildProcess) {
  const stdio: unknown[] = child.stdio;
  if (stdio.length === 5) {
    return stdio as [
      NodeJS.WriteStream,
      NodeJS.ReadStream,
      NodeJS.ReadStream,
      NodeJS.WriteStream,
      NodeJS.ReadStream
    ];
  }
  throw new Error("expected process to have 5 stdio streams");
}
