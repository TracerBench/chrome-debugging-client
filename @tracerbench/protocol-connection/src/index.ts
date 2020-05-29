import type { AttachMessageTransport } from "@tracerbench/message-transport";
import newAttachProtocolTransport, {
  DebugCallback,
} from "@tracerbench/protocol-transport";
import type { RaceCancellation } from "race-cancellation";

import type { EventEmitter, RootConnection } from "../types";
import _newProtocolConnection from "./newProtocolConnection";

/**
 * Creates a ProtocolConnection to the DevTools API from a MessageTransport.
 */
export default function newProtocolConnection(
  attach: AttachMessageTransport,
  newEventEmitter: () => EventEmitter,
  debug: DebugCallback = () => void 0,
  raceCancellation?: RaceCancellation,
): RootConnection {
  return _newProtocolConnection(
    newAttachProtocolTransport(attach, debug, raceCancellation),
    newEventEmitter,
  );
}

export { default as newProtocolConnection } from "./newProtocolConnection";
export type {
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
} from "../types";
