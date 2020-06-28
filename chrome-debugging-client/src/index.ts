import type {
  AttachMessageTransport,
  RootConnection,
} from "@tracerbench/protocol-connection";
import _newProtocolConnection from "@tracerbench/protocol-connection";
import _spawn from "@tracerbench/spawn";
import type {
  Chrome,
  ChromeSpawnOptions,
  Process,
  ProcessWithPipeMessageTransport,
  Stdio,
} from "@tracerbench/spawn-chrome";
import _spawnChrome from "@tracerbench/spawn-chrome";
import openWebSocket from "@tracerbench/websocket-message-transport";
import debug = require("debug");
import { EventEmitter } from "events";
import type { RaceCancellation } from "race-cancellation";
import { combineRaceCancellation, isCancellation } from "race-cancellation";

const debugSpawn = debug("chrome-debugging-client:spawn");
const debugTransport = debug("chrome-debugging-client:transport");

export function spawnChrome(
  options?: Partial<ChromeSpawnOptions>,
): ChromeWithPipeConnection {
  return attachPipeTransport(_spawnChrome(options, debugSpawn));
}

export function spawnWithPipe(
  executable: string,
  args: string[],
  options?: Partial<ChromeSpawnOptions>,
): ProcessWithPipeConnection {
  return attachPipeTransport(
    _spawn(executable, args, options, "pipe", debugSpawn),
  );
}

export async function spawnWithWebSocket(
  executable: string,
  args: string[],
  stdio?: Stdio,
  raceCancellation?: RaceCancellation,
): Promise<ProcessWithWebSocketConnection> {
  const process = _spawn(executable, args, stdio, "websocket", debugSpawn);
  const url = await process.url(raceCancellation);
  const [attach, close] = await openWebSocket(
    url,
    combineRaceCancellation(process.raceExit, raceCancellation),
  );
  const connection = newProtocolConnection(attach, process.raceExit);
  return Object.assign(process, { connection, close });
}

export function newProtocolConnection(
  attach: AttachMessageTransport,
  raceCancellation?: RaceCancellation,
): RootConnection {
  return _newProtocolConnection(
    attach,
    () => new EventEmitter(),
    debugTransport,
    raceCancellation,
  );
}

export { default as openWebSocket } from "@tracerbench/websocket-message-transport";

export { default as findChrome } from "@tracerbench/find-chrome";

function attachPipeTransport<P extends ProcessWithPipeMessageTransport>(
  process: P,
): P & {
  connection: RootConnection;
  close(timeout?: number, raceCancellation?: RaceCancellation): Promise<void>;
} {
  const connection = newProtocolConnection(process.attach, process.raceExit);
  return Object.assign(process, { close, connection });

  async function close(
    timeout?: number,
    raceCancellation?: RaceCancellation,
  ): Promise<void> {
    if (process.hasExited()) {
      return;
    }
    try {
      const waitForExit = process.waitForExit(timeout, raceCancellation);
      await Promise.race([waitForExit, sendBrowserClose()]);
      // double check in case send() won the race which is most of the time
      // sometimes chrome exits before send() gets a response
      await waitForExit;
    } catch (e) {
      // if we closed then we dont really care what the error is
      if (!process.hasExited()) {
        throw e;
      }
    }
  }

  async function sendBrowserClose(): Promise<void> {
    try {
      await connection.send("Browser.close");
    } catch (e) {
      // the browser sometimes closes the connection before sending
      // the response which will cancel the send
      if (!isCancellation(e)) {
        throw e;
      }
    }
  }
}

export interface ChromeWithPipeConnection extends Chrome {
  /**
   * Connection to devtools protocol https://chromedevtools.github.io/devtools-protocol/
   */
  connection: RootConnection;

  /**
   * Close browser.
   */
  close(timeout?: number, raceCancellation?: RaceCancellation): Promise<void>;
}

export interface ProcessWithPipeConnection extends Process {
  /**
   * Connection to devtools protocol https://chromedevtools.github.io/devtools-protocol/
   */
  connection: RootConnection;

  /**
   * Close browser.
   */
  close(timeout?: number, raceCancellation?: RaceCancellation): Promise<void>;
}

export interface ProcessWithWebSocketConnection extends Process {
  /**
   * Connection to devtools protocol https://chromedevtools.github.io/devtools-protocol/
   */
  connection: RootConnection;

  /**
   * Closes the web socket.
   */
  close(): void;
}

export type {
  AttachJsonRpcTransport,
  AttachMessageTransport,
  AttachProtocolTransport,
  AttachSession,
  Cancellation,
  DebugCallback,
  DetachSession,
  ErrorResponse,
  Notification,
  OnClose,
  OnError,
  OnEvent,
  OnMessage,
  OnNotification,
  Protocol,
  ProtocolMapping,
  ProtocolError,
  ProtocolTransport,
  RaceCancellation,
  Request,
  Response,
  ResponseError,
  SendMessage,
  SendMethod,
  SendRequest,
  SuccessResponse,
  Task,
  ProtocolConnection,
  SessionConnection,
  RootConnection,
  ProtocolConnectionBase,
  EventListener,
  EventEmitter,
  EventPredicate,
  NewEventEmitter,
  TargetID,
  TargetInfo,
  SessionID,
  Method,
  Event,
  EventMapping,
  RequestMapping,
  ResponseMapping,
  VoidRequestMethod,
  MappedRequestMethod,
  MaybeMappedRequestMethod,
  VoidResponseMethod,
  MappedResponseMethod,
  VoidRequestVoidResponseMethod,
  VoidRequestMappedResponseMethod,
  VoidEvent,
  MappedEvent,
  SessionIdentifier,
} from "@tracerbench/protocol-connection";
export type {
  Process,
  ProcessWithPipeMessageTransport,
  ProcessWithWebSocketUrl,
  SpawnOptions,
  Stdio,
  Transport,
  TransportMapping,
  ArgumentOptions,
  ChromeSpawnOptions,
  Chrome,
} from "@tracerbench/spawn-chrome";
