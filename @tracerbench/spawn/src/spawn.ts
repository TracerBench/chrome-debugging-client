import debug from "debug";

import {
  DebugCallback,
  ProcessWithPipeMessageTransport,
  ProcessWithWebSocketUrl,
  Stdio,
  Transport,
} from "../types";
import newProcessWithPipeMessageTransport from "./newProcessWithPipeMessageTransport";
import newProcessWithWebSocketUrl from "./newProcessWithWebSocketUrl";

function spawn(
  executable: string,
  args: string[],
  stderr: Stdio | undefined,
  transport: "websocket",
  debugCallback?: DebugCallback,
): ProcessWithWebSocketUrl;
function spawn(
  executable: string,
  args: string[],
  stderr?: Stdio,
  transport?: "pipe",
  debugCallback?: DebugCallback,
): ProcessWithPipeMessageTransport;
function spawn(
  executable: string,
  args: string[],
  stderr: Stdio = "ignore",
  transport: Transport = "pipe",
  debugCallback: DebugCallback = debug("@tracerbench/spawn"),
): ProcessWithPipeMessageTransport | ProcessWithWebSocketUrl {
  switch (transport) {
    case "pipe":
      return newProcessWithPipeMessageTransport(
        executable,
        args,
        stderr,
        debugCallback,
      );
    case "websocket":
      return newProcessWithWebSocketUrl(
        executable,
        args,
        stderr,
        debugCallback,
      );
    default:
      throw invalidTransport(transport);
  }
}

function invalidTransport(transport: never): Error {
  return new Error(`invalid transport argument "${String(transport)}"`);
}

export default spawn;
