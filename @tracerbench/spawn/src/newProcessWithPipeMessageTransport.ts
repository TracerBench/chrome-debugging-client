import type { ProcessWithPipeMessageTransport, SpawnOptions } from "../types";
import execa from "./execa";
import createPipeMessageTransport from "./newPipeMessageTransport";
import newProcess from "./newProcess";

export default function newProcessWithPipeMessageTransport(
  command: string,
  args: string[],
  options: Partial<SpawnOptions>,
  debugCallback: (formatter: unknown, ...args: unknown[]) => void,
): ProcessWithPipeMessageTransport {
  const { stdio = "ignore", cwd, env, extendEnv } = options;
  const child = execa(
    command,
    args,
    {
      // disable buffer, pipe or drain
      buffer: false,
      stdio: [stdio, stdio, stdio, "pipe", "pipe"],
      cwd,
      extendEnv,
      env,
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
    void child.on("error", onClose);
    void child.on("exit", onClose);

    readStream.on("data", handleReadData);
    readStream.on("end", handleReadEnd);
    readStream.on("error", handleReadError);

    writeStream.on("close", handleWriteClose);
    writeStream.on("error", handleWriteError);

    return [(data) => writeStream.write(data), () => writeStream.end()];

    function handleReadData(buffer: Buffer): void {
      debugEvent("read", "data", buffer.byteLength);
      onRead(buffer);
    }

    function handleReadEnd(): void {
      debugEvent("read", "end");
      onReadEnd();
    }

    function handleReadError(error: Error): void {
      debugEvent("read", "error", error);
    }

    function handleWriteError(error: Error | NodeJS.ErrnoException): void {
      debugEvent("write", "error", error);
      // writes while the other side is closing can cause EPIPE
      // just wait for close to actually happen and ignore it.
      if (error && "code" in error && error.code === "EPIPE") {
        return;
      }
      onClose(error);
    }

    function handleWriteClose(): void {
      debugEvent("write", "close");
      onClose();
    }

    function debugEvent(
      pipe: "read" | "write",
      event: string,
      arg?: unknown,
    ): void {
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
