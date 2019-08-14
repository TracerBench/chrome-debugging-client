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
  debugCallback: (formatter: any, ...args: any[]) => void,
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
  return Object.assign(process, {
    url: createUrl(child.stderr!, stdio, process.raceExit),
  });
}

function createUrl(
  stderr: NodeJS.ReadableStream,
  stdio: Stdio,
  raceExit: RaceCancellation,
) {
  let promise: Promise<string> | undefined;
  return url;

  async function url(raceCancellation?: RaceCancellation) {
    return throwIfCancelled(
      await combineRaceCancellation(raceExit, raceCancellation)(() => {
        if (promise === undefined) {
          promise = new Promise(resolve => parseUrl(stderr, stdio, resolve));
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
) {
  const parser = newWebSocketUrlParser(callback);
  stderr.pipe(parser);
  if (stdio === "inherit") {
    parser.pipe(process.stderr);
  } else if (stdio === "ignore") {
    parser.on("data", () => void 0);
  } else {
    throw new Error(`invalid stdio arg ${stdio} expected ignore or inherit`);
  }
}
