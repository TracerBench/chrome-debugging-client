import debug = require("debug");
import { EventEmitter } from "events";
import {
  cancellableRace,
  Cancellation,
  disposablePromise,
  RaceCancellation,
  throwIfCancelled,
  withRaceTimeout,
} from "race-cancellation";

import * as t from "../types";

const debugCallback = debug("@tracerbench/spawn");

export default function newProcess(
  child: import("execa").ExecaChildProcess,
): t.Process {
  let hasExited = false;
  let lastError: Error | undefined;

  const emitter = new EventEmitter();
  const [raceExit, cancel] = cancellableRace();

  child.on("error", error => {
    lastError = error;
    debugCallback("child process error %O", error);
    onExit(error);
  });
  child.on("exit", () => {
    debugCallback("child process exit");
    onExit();
  });

  return {
    dispose,
    hasExited: () => hasExited,
    kill,
    off: emitter.removeListener.bind(emitter),
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    raceExit,
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
    waitForExit,
  };

  function onExit(error?: Error) {
    if (hasExited) {
      return;
    }

    hasExited = true;

    if (error) {
      cancel(`process exited early: ${error.message}`);
    } else {
      cancel(`process exited early`);
    }

    emitter.emit("exit");
  }

  async function exited(
    raceCancellation?: RaceCancellation,
  ): Promise<void | Cancellation> {
    if (lastError) {
      throw lastError;
    }

    if (hasExited) {
      return;
    }

    return await disposablePromise((resolve, reject) => {
      child.on("exit", resolve);
      child.on("error", reject);
      return () => {
        child.removeListener("exit", resolve);
        child.removeListener("error", reject);
      };
    }, raceCancellation);
  }

  async function waitForExit(
    timeout = 10000,
    raceCancellation?: RaceCancellation,
  ) {
    if (hasExited) {
      return;
    }

    const result = await (timeout > 0
      ? withRaceTimeout(exited, timeout)(raceCancellation)
      : exited(raceCancellation));
    return throwIfCancelled(result);
  }

  async function kill(timeout?: number, raceCancellation?: RaceCancellation) {
    if (hasExited) {
      return;
    }

    if (child.killed || !child.pid) {
      return;
    }

    child.kill();

    await waitForExit(timeout, raceCancellation);
  }

  async function dispose(): Promise<void> {
    if (hasExited) {
      return;
    }

    try {
      await kill();
    } catch (e) {
      // dispose is in finally and meant to be safe
      // we don't want to cover up error
      // just output for debugging
      debugCallback("dispose error %O", e);
    }
  }
}
