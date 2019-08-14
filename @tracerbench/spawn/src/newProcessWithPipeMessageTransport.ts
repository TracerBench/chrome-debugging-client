import { ProcessWithPipeMessageTransport, Stdio } from "../types";

import execa from "./execa";
import createPipeMessageTransport from "./newPipeMessageTransport";
import newProcess from "./newProcess";

export default function newProcessWithPipeMessageTransport(
  command: string,
  args: string[],
  stdio: Stdio,
  debugCallback: (formatter: any, ...args: any[]) => void,
): ProcessWithPipeMessageTransport {
  const child = execa(
    command,
    args,
    {
      // disable buffer, pipe or drain
      buffer: false,
      stdio: [stdio, stdio, stdio, "pipe", "pipe"],
    },
    debugCallback,
  );

  const process = newProcess(child, command, debugCallback);
  const [, , , writeStream, readStream] = child.stdio as [
    NodeJS.WritableStream,
    NodeJS.ReadableStream,
    NodeJS.ReadableStream,
    NodeJS.WritableStream,
    NodeJS.ReadableStream,
  ];

  const attach = createPipeMessageTransport((onRead, onReadEnd, onClose) => {
    child.on("error", onClose);
    child.on("exit", onClose);

    readStream.on("data", handleReadData);
    readStream.on("end", handleReadEnd);
    readStream.on("error", handleReadError);

    writeStream.on("close", handleWriteClose);
    writeStream.on("error", handleWriteError);

    return [data => writeStream.write(data), () => writeStream.end()];

    function handleReadData(buffer: Buffer) {
      debugEvent("read", "data", buffer.byteLength);
      onRead(buffer);
    }

    function handleReadEnd() {
      debugEvent("read", "end");
      onReadEnd();
    }

    function handleReadError(error: Error) {
      debugEvent("read", "error", error);
    }

    function handleWriteError(error: Error | NodeJS.ErrnoException) {
      debugEvent("write", "error", error);
      // writes while the other side is closing can cause EPIPE
      // just wait for close to actually happen and ignore it.
      if (error && "code" in error && error.code === "EPIPE") {
        return;
      }
      onClose(error);
    }

    function handleWriteClose() {
      debugEvent("write", "close");
      onClose();
    }

    function debugEvent(pipe: "read" | "write", event: string, arg?: any) {
      if (arg === undefined) {
        debugCallback("%s pipe (pid: %o) %o event", pipe, child.pid, event);
      } else {
        debugCallback(
          "%s pipe (pid: %o) %o event: %O",
          pipe,
          child.pid,
          event,
          arg,
        );
      }
    }
  });

  return Object.assign(process, { attach });
}
