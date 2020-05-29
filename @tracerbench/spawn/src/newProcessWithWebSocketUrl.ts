import {
  combineRaceCancellation,
  RaceCancellation,
  throwIfCancelled,
} from "race-cancellation";

import { ProcessWithWebSocketUrl, Stdio } from "../types";
import execa from "./execa";
import newProcess from "./newProcess";
import newWebSocketUrlParser from "./newWebSocketUrlParser";

export default function newProcessWithWebSocketUrl(
  command: string,
  args: string[],
  stdio: Stdio,
  debugCallback: (formatter: unknown, ...args: unknown[]) => void,
): ProcessWithWebSocketUrl {
  const child = execa(
    command,
    args,
    {
      // disable buffer, pipe or drain
      buffer: false,
      stdio: [stdio, stdio, "pipe"],
    },
    debugCallback,
  );

  const process = newProcess(child, command, debugCallback);
  if (child.stderr === null) {
    throw new Error("missing stderr");
  }
  return Object.assign(process, {
    url: createUrl(child.stderr, stdio, process.raceExit),
  });
}

function createUrl(
  stderr: NodeJS.ReadableStream,
  stdio: Stdio,
  raceExit: RaceCancellation,
): (race?: RaceCancellation) => Promise<string> {
  let promise: Promise<string> | undefined;
  return url;

  async function url(raceCancellation?: RaceCancellation): Promise<string> {
    return throwIfCancelled(
      await combineRaceCancellation(
        raceExit,
        raceCancellation,
      )(() => {
        if (promise === undefined) {
          promise = new Promise((resolve) => parseUrl(stderr, stdio, resolve));
        }
        return promise;
      }),
    );
  }
}

function parseUrl(
  stderr: NodeJS.ReadableStream,
  stdio: "inherit" | "ignore",
  callback: (url: string) => void,
): void {
  const parser = newWebSocketUrlParser(callback);
  stderr.pipe(parser);
  if (stdio === "inherit") {
    parser.pipe(process.stderr);
  } else if (stdio === "ignore") {
    parser.on("data", () => void 0);
  } else {
    throw new Error(
      `invalid stdio arg ${String(stdio)} expected ignore or inherit`,
    );
  }
}
