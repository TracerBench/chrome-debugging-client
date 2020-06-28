import type {
  AttachMessageTransport,
  OnClose,
  OnMessage,
  SendMessage,
} from "@tracerbench/message-transport";
import type { Cancellation, RaceCancellation, Task } from "race-cancellation";

export type {
  AttachMessageTransport,
  OnClose,
  OnMessage,
  SendMessage,
  Cancellation,
  RaceCancellation,
  Task,
};

export type DebugCallback = (formatter: unknown, ...args: unknown[]) => void;

export interface Process {
  /**
   * Allows tasks to be raced against the exit of the process.
   */
  raceExit: RaceCancellation;

  hasExited(): boolean;

  /**
   * Sends a SIGTERM with a timeout, if the process has not
   * exited by the timeout it sends a SIGKILL
   * @param options
   */
  kill(timeout?: number, raceCancellation?: RaceCancellation): Promise<void>;

  /**
   * Waits for exit of the process.
   * @param options
   */
  waitForExit(
    timeout?: number,
    raceCancellation?: RaceCancellation,
  ): Promise<void>;

  /**
   * Same as kill but an error will become an event since
   * this is intended to be awaited in a finally block.
   */
  dispose(): Promise<void>;

  on(event: "error", listener: (error: Error) => void): void;
  on(event: "exit", listener: () => void): void;
  once(event: "error", listener: (error: Error) => void): void;
  once(event: "exit", listener: () => void): void;
  off(event: "error", listener: (error: Error) => void): void;
  off(event: "exit", listener: () => void): void;
  removeListener(event: "error", listener: (error: Error) => void): void;
  removeListener(event: "exit", listener: () => void): void;
  removeAllListeners(event?: "error" | "exit"): void;
}

export interface ProcessWithWebSocketUrl extends Process {
  url: (raceCancellation?: RaceCancellation) => Promise<string>;
}

export interface ProcessWithPipeMessageTransport extends Process {
  attach: AttachMessageTransport;
}

export type TransportMapping = {
  pipe: ProcessWithPipeMessageTransport;
  websocket: ProcessWithWebSocketUrl;
};

export type Transport = keyof TransportMapping;

export type Stdio = "ignore" | "inherit";

export interface SpawnOptions {
  stdio: Stdio;
  cwd: string | undefined;
  extendEnv: boolean | undefined;
  env:
    | {
        [name: string]: string | undefined;
      }
    | undefined;
}
