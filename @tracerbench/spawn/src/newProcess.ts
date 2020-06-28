import { EventEmitter } from "events";
import type { ExecaChildProcess } from "execa";
import {
  cancellableRace,
  disposablePromise,
  throwIfCancelled,
  withRaceTimeout,
} from "race-cancellation";

import type {
  Cancellation,
  DebugCallback,
  Process,
  RaceCancellation,
} from "../types";

export default function newProcess(
  child: ExecaChildProcess,
  command: string,
  debugCallback: DebugCallback,
): Process {
  let hasExited = false;
  let lastError: Error | undefined;

  const emitter = new EventEmitter();
  const [raceExit, cancel] = cancellableRace();

  void child.on("error", (error) => {
    lastError = error;
    debugCallback("%o (pid: %o) 'error' event: %O", command, child.pid, error);
    onErrorOrExit(error);
  });

  void child.on("exit", () => {
    debugCallback("%o (pid: %o) 'exit' event", command, child.pid);
    onErrorOrExit();
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

  /*
    https://nodejs.org/api/child_process.html#child_process_event_exit

    The 'exit' event may or may not fire after an error has occurred.
    When listening to both the 'exit' and 'error' events, it is important to guard against accidentally invoking handler functions multiple times.
   */
  function onErrorOrExit(error?: Error): void {
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
      void child.on("exit", resolve);
      void child.on("error", reject);
      return () => {
        void child.removeListener("exit", resolve);
        void child.removeListener("error", reject);
      };
    }, raceCancellation);
  }

  async function waitForExit(
    timeout = 10000,
    raceCancellation?: RaceCancellation,
  ): Promise<void> {
    if (hasExited) {
      return;
    }

    const result = await (timeout > 0
      ? withRaceTimeout(exited, timeout)(raceCancellation)
      : exited(raceCancellation));
    return throwIfCancelled(result);
  }

  async function kill(
    timeout?: number,
    raceCancellation?: RaceCancellation,
  ): Promise<void> {
    if (!child.killed && child.pid) {
      child.kill();
    }

    await waitForExit(timeout, raceCancellation);
  }

  async function dispose(): Promise<void> {
    try {
      await kill();
    } catch (e) {
      // dispose is in finally and meant to be safe
      // we don't want to cover up error
      // just output for debugging
      debugCallback("%o (pid: %o) dispose error: %O", command, child.pid, e);
    }
  }
}
