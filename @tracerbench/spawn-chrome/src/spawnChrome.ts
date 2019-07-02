import findChrome from "@tracerbench/find-chrome";
import spawn from "@tracerbench/spawn";

import { Chrome, SpawnOptions } from "../types";

import canonicalizeOptions from "./canonicalizeOptions";
import createTempDir from "./createTmpDir";
import getArguments from "./getArguments";

export default function spawnChrome(options?: Partial<SpawnOptions>): Chrome {
  const canonicalized = canonicalizeOptions(options);

  let chromeExecutable = canonicalized.chromeExecutable;
  if (chromeExecutable === undefined) {
    chromeExecutable = findChrome();
  }

  let userDataDir = canonicalized.userDataDir;
  let removeTmp: (() => void) | undefined;
  if (userDataDir === undefined) {
    [userDataDir, removeTmp] = createTempDir(canonicalized.userDataRoot);
  }

  const args = getArguments(userDataDir, canonicalized);

  const process = Object.assign(
    spawn(chromeExecutable, args, "ignore", "pipe"),
    {
      userDataDir,
    },
  );

  if (removeTmp !== undefined) {
    process.on("exit", removeTmp);
  }

  return process;
}
