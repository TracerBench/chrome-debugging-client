import { AttachMessageTransport } from "@tracerbench/message-transport";
import newAttachProtocolTransport, {
  DebugCallback,
} from "@tracerbench/protocol-transport";
import { EventEmitter } from "../types";
import _newProtocolConnection from "./newProtocolConnection";

/**
 * Creates a ProtocolConnection to the DevTools API from a MessageTransport.
 */
export default function newProtocolConnection(
  attach: AttachMessageTransport,
  newEventEmitter: () => EventEmitter,
  debug: DebugCallback = () => void 0,
) {
  return _newProtocolConnection(
    newAttachProtocolTransport(attach, debug),
    newEventEmitter,
  );
}

export { default as newProtocolConnection } from "./newProtocolConnection";
export * from "../types";
