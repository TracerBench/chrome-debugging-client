import { AttachMessageTransport } from "@tracerbench/message-transport";
import newAttachProtocolTransport, {
  DebugCallback,
} from "@tracerbench/protocol-transport";
import { RaceCancellation } from "race-cancellation";

import { EventEmitter } from "../types";

import _newProtocolConnection from "./newProtocolConnection";

/**
 * Creates a ProtocolConnection to the DevTools API from a MessageTransport.
 */
export default function newProtocolConnection(
  attach: AttachMessageTransport,
  newEventEmitter: () => EventEmitter,
  debug: DebugCallback = () => void 0,
  raceCancellation?: RaceCancellation,
) {
  return _newProtocolConnection(
    newAttachProtocolTransport(attach, debug, raceCancellation),
    newEventEmitter,
  );
}

export { default as newProtocolConnection } from "./newProtocolConnection";
export * from "../types";
