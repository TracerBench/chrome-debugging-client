import type {
  AttachMessageTransport,
  AttachProtocolTransport,
  DebugCallback,
  RaceCancellation,
} from "../types";
import newAttachJsonRpcTransport from "./newAttachJsonRpcTransport";
import _newAttachProtocolTransport from "./newAttachProtocolTransport";

export default function newAttachProtocolTransport<SessionId>(
  attach: AttachMessageTransport,
  debug: DebugCallback = () => void 0,
  raceCancellation?: RaceCancellation,
): AttachProtocolTransport<SessionId> {
  return _newAttachProtocolTransport<SessionId>(
    newAttachJsonRpcTransport(attach, debug, raceCancellation),
  );
}

export { default as newAttachJsonRpcTransport } from "./newAttachJsonRpcTransport";
export { default as newAttachProtocolTransport } from "./newAttachProtocolTransport";
export { isProtocolError } from "./newProtocolError";
export type {
  AttachMessageTransport,
  OnClose,
  OnMessage,
  SendMessage,
  Cancellation,
  RaceCancellation,
  Task,
  AttachJsonRpcTransport,
  SendRequest,
  AttachProtocolTransport,
  ProtocolTransport,
  AttachSession,
  DetachSession,
  SendMethod,
  SuccessResponse,
  ErrorResponse,
  ResponseError,
  Response,
  Request,
  Notification,
  DebugCallback,
  ProtocolError,
  OnNotification,
  OnError,
  OnEvent,
} from "../types";
