import { AttachMessageTransport } from "@tracerbench/message-transport";
import { DebugCallback } from "../types";
import newAttachJsonRpcTransport from "./newAttachJsonRpcTransport";
import _newAttachProtocolTransport from "./newAttachProtocolTransport";

export default function newAttachProtocolTransport(
  attach: AttachMessageTransport,
  debug: DebugCallback = () => void 0,
) {
  return _newAttachProtocolTransport(newAttachJsonRpcTransport(attach, debug));
}

export {
  default as newAttachJsonRpcTransport,
} from "./newAttachJsonRpcTransport";
export {
  default as newAttachProtocolTransport,
} from "./newAttachProtocolTransport";
export { isProtocolError } from "./newProtocolError";
export * from "../types";
