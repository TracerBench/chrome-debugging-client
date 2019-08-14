import debug from "debug";

import * as t from "../types";

import newProcessWithPipeMessageTransport from "./newProcessWithPipeMessageTransport";
import newProcessWithWebSocketUrl from "./newProcessWithWebSocketUrl";

const debugCallback = debug("@tracerbench/spawn");

export default function spawn<T extends t.Transport>(
  executable: string,
  args: string[],
  stdio: t.Stdio | undefined,
  transport: T,
): t.TransportMapping[T];
export default function spawn<T extends t.Transport>(
  executable: string,
  args: string[],
  stdio?: t.Stdio,
): t.ProcessWithPipeMessageTransport;
export default function spawn(
  executable: string,
  args: string[],
  stdio: t.Stdio = "ignore",
  transport: t.Transport = "pipe",
): t.TransportMapping[t.Transport] {
  switch (transport) {
    case "pipe":
      return newProcessWithPipeMessageTransport(
        executable,
        args,
        stdio,
        debugCallback,
      );
    case "websocket":
      return newProcessWithWebSocketUrl(executable, args, stdio, debugCallback);
    default:
      throw invalidTransport(transport);
  }
}

function invalidTransport(transport: never) {
  return new Error(`invalid transport argument "${transport}"`);
}
