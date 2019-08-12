import { AttachMessageTransport } from "@tracerbench/message-transport";
import { RaceCancellation } from "race-cancellation";

import { DebugCallback } from "../types";

import newAttachJsonRpcTransport from "./newAttachJsonRpcTransport";
import _newAttachProtocolTransport from "./newAttachProtocolTransport";

export default function newAttachProtocolTransport<SessionId>(
  attach: AttachMessageTransport,
  debug: DebugCallback = () => void 0,
  raceCancellation?: RaceCancellation,
) {
  return _newAttachProtocolTransport<SessionId>(
    newAttachJsonRpcTransport(attach, debug, raceCancellation),
  );
}

export {
  default as newAttachJsonRpcTransport,
} from "./newAttachJsonRpcTransport";
export {
  default as newAttachProtocolTransport,
} from "./newAttachProtocolTransport";
export { isProtocolError } from "./newProtocolError";
export * from "../types";
