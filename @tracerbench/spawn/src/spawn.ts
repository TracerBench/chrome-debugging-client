import debug from "debug";

import type {
  DebugCallback,
  ProcessWithPipeMessageTransport,
  ProcessWithWebSocketUrl,
  SpawnOptions,
  Stdio,
  Transport,
} from "../types";
import newProcessWithPipeMessageTransport from "./newProcessWithPipeMessageTransport";
import newProcessWithWebSocketUrl from "./newProcessWithWebSocketUrl";

function spawn(
  executable: string,
  args: string[],
  options: Stdio | Partial<SpawnOptions> | undefined,
  transport: "websocket",
  debugCallback?: DebugCallback,
): ProcessWithWebSocketUrl;
function spawn(
  executable: string,
  args: string[],
  options?: Stdio | Partial<SpawnOptions>,
  transport?: "pipe",
  debugCallback?: DebugCallback,
): ProcessWithPipeMessageTransport;
function spawn(
  executable: string,
  args: string[],
  options: Stdio | Partial<SpawnOptions> = { stdio: "ignore" },
  transport: Transport = "pipe",
  debugCallback: DebugCallback = debug("@tracerbench/spawn"),
): ProcessWithPipeMessageTransport | ProcessWithWebSocketUrl {
  if (typeof options === "string") {
    options = { stdio: options };
  }
  switch (transport) {
    case "pipe":
      return newProcessWithPipeMessageTransport(
        executable,
        args,
        options,
        debugCallback,
      );
    case "websocket":
      return newProcessWithWebSocketUrl(
        executable,
        args,
        options,
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
