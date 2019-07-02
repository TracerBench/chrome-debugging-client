import debug from "debug";
import execa = require("execa");

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
  const opts: execa.Options = {
    // disable buffer, pipe or drain
    buffer: false,
    stdio: stdioFor(stdio, transport),
  };

  debugCallback("execa(%o, %O, %O)", executable, args, opts);
  const child = execa(executable, args, opts);

  // even though the child promise is a promise of exit
  // it rejects on being signalled
  child.catch(() => {
    // ignore unhandled rejection from sending signal
  });

  switch (transport) {
    case "pipe":
      return newProcessWithPipeMessageTransport(child);
    case "websocket":
      return newProcessWithWebSocketUrl(child, stdio);
    default:
      throw invalidTransport(transport);
  }
}

function stdioFor(
  stdio: "ignore" | "inherit",
  transport: "pipe" | "websocket",
): readonly execa.StdioOption[] {
  if (transport === "pipe") {
    return [stdio, stdio, stdio, "pipe", "pipe"];
  }
  if (transport === "websocket") {
    return [stdio, stdio, "pipe"];
  }
  throw new Error(`invalid transport argument ${transport}`);
}

function invalidTransport(transport: never) {
  return new Error(`invalid transport argument "${transport}"`);
}
