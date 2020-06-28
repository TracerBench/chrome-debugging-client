import findChrome from "@tracerbench/find-chrome";
import spawn from "@tracerbench/spawn";

import type { Chrome, ChromeSpawnOptions, DebugCallback } from "../types";
import canonicalizeOptions from "./canonicalizeOptions";
import createTempDir from "./createTmpDir";
import getArguments from "./getArguments";

export default function spawnChrome(
  options?: Partial<ChromeSpawnOptions>,
  debugCallback?: DebugCallback,
): Chrome {
  const canonicalized = canonicalizeOptions(options);

  let chromeExecutable = canonicalized.chromeExecutable;
  if (chromeExecutable === undefined) {
    chromeExecutable = findChrome();
  }

  let userDataDir = canonicalized.userDataDir;
  let onExit: (() => void) | undefined;
  if (userDataDir === undefined) {
    const [tmpDir, removeTmpDir] = createTempDir(canonicalized.userDataRoot);
    userDataDir = tmpDir;
    onExit = () => {
      try {
        removeTmpDir();
      } catch (e) {
        if (debugCallback !== undefined) {
          debugCallback(
            "Removing temp user data dir %o failed with %o",
            tmpDir,
            e,
          );
        }
      }
    };
  }

  const args = getArguments(userDataDir, canonicalized);

  const chromeProcess = Object.assign(
    spawn(chromeExecutable, args, canonicalized, "pipe", debugCallback),
    {
      userDataDir,
    },
  );

  if (onExit !== undefined) {
    chromeProcess.once("exit", onExit);
  }

  return chromeProcess;
}
