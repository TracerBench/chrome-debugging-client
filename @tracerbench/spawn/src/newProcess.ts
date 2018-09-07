import { EventEmitter } from "events";
import {
  Cancellation,
  CancellationKind,
  isCancellation,
  newRaceCancellation,
  oneshot,
  RaceCancellation,
  throwIfCancelled,
  withRaceTimeout,
} from "race-cancellation";
import * as t from "../types";

export default function newProcess(
  child: import("execa").ExecaChildProcess,
): t.Process {
  let hasExited = false;
  const [exited, onExit] = oneshot<void>();
  const emitter = new EventEmitter();

  const raceExit = newRaceCancellation(
    exited,
    "the process exited before the async task using it was completed",
    "UnexpectedProcessExit",
  );

  child.on("exit", () => {
    onExit();
    hasExited = true;
    emitter.emit("exit");
  });

  child.on("error", error => {
    emitter.emit("error", error);
  });

  return {
    dispose,
    hasExited: () => hasExited,
    kill,
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    raceExit,
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
    waitForExit,
  };

  async function kill(timeout?: number, raceCancellation?: RaceCancellation) {
    if (hasExited) {
      return;
    }
    child.kill("SIGTERM");

    try {
      await waitForExit(timeout, raceCancellation);
    } catch (e) {
      if (!hasExited) {
        child.kill("SIGKILL");
        if (isCancellation(e, CancellationKind.Timeout)) {
          return await waitForExit(timeout, raceCancellation);
        }
      }
      throw e;
    }
  }

  async function dispose(): Promise<void> {
    if (hasExited) {
      return;
    }
    try {
      await kill();
    } catch (e) {
      // dispose is in finally, we don't want to cover up error
      emitter.emit("error", e);
    }
  }

  async function waitForExit(
    timeout = 3000,
    raceCancellation?: RaceCancellation,
  ) {
    let result: void | Cancellation;
    if (timeout > 0) {
      result = await withRaceTimeout(
        raceTimeout => raceTimeout(exited),
        timeout,
      )(raceCancellation);
    } else if (raceCancellation !== undefined) {
      result = await raceCancellation(exited);
    } else {
      result = await exited();
    }
    return throwIfCancelled(result);
  }
}
