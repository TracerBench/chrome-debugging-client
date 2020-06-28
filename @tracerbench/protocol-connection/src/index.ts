import newAttachProtocolTransport from "@tracerbench/protocol-transport";

import type {
  AttachMessageTransport,
  DebugCallback,
  EventEmitter,
  RaceCancellation,
  RootConnection,
} from "../types";
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
} from "../types";
