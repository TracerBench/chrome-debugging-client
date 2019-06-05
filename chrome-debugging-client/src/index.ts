import { AttachMessageTransport } from "@tracerbench/message-transport";
import _newProtocolConnection, {
  ProtocolConnection,
} from "@tracerbench/protocol-connection";
import _spawn, {
  Process,
  ProcessWithPipeMessageTransport,
  Stdio,
} from "@tracerbench/spawn";
import _spawnChrome, { Chrome, SpawnOptions } from "@tracerbench/spawn-chrome";
import openWebSocket from "@tracerbench/websocket-message-transport";
import debug = require("debug");
import { EventEmitter } from "events";
import { combineRaceCancellation, RaceCancellation } from "race-cancellation";

const debugCallback = debug("chrome-debugging-client");

export function spawnChrome(options?: SpawnOptions): ChromeWithPipeConnection {
  return attachPipeTransport(_spawnChrome(options));
}

export function spawnWithPipe(
  executable: string,
  args: string[],
  stdio?: Stdio,
): ProcessWithPipeConnection {
  return attachPipeTransport(_spawn(executable, args, stdio, "pipe"));
}

export async function spawnWithWebSocket(
  executable: string,
  args: string[],
  stdio?: Stdio,
  raceCancellation?: RaceCancellation,
): Promise<ProcessWithWebSocketConnection> {
  const process = _spawn(executable, args, stdio, "websocket");
  const url = await process.url(raceCancellation);
  const [attach, close] = await openWebSocket(
    url,
    combineRaceCancellation(process.raceExit, raceCancellation),
  );
  const connection = newProtocolConnection(attach);
  return Object.assign(process, { connection, close });
}

export function newProtocolConnection(
  attach: AttachMessageTransport,
): ProtocolConnection {
  return _newProtocolConnection(
    attach,
    () => new EventEmitter(),
    debugCallback,
  );
}

export {
  default as openWebSocket,
} from "@tracerbench/websocket-message-transport";

export { default as findChrome } from "@tracerbench/find-chrome";

function attachPipeTransport<P extends ProcessWithPipeMessageTransport>(
  process: P,
): P & { connection: ProtocolConnection } {
  const connection = newProtocolConnection(process.attach);
  return Object.assign(process, { connection });
}

export interface ChromeWithPipeConnection extends Chrome {
  /**
   * Connection to devtools protocol https://chromedevtools.github.io/devtools-protocol/
   */
  connection: ProtocolConnection;
}

export interface ProcessWithPipeConnection extends Process {
  /**
   * Connection to devtools protocol https://chromedevtools.github.io/devtools-protocol/
   */
  connection: ProtocolConnection;
}

export interface ProcessWithWebSocketConnection extends Process {
  /**
   * Connection to devtools protocol https://chromedevtools.github.io/devtools-protocol/
   */
  connection: ProtocolConnection;

  /**
   * Closes the web socket.
   */
  close(): void;
}
