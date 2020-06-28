import type {
  AttachJsonRpcTransport,
  AttachProtocolTransport,
  Notification,
  RaceCancellation,
} from "../types";
import newProtocolError from "./newProtocolError";
import newSessions from "./newSessions";

/**
 * Adapts a AttachJsonRpcTransport function to a AttachProtocolTransport function.
 *
 * Adds support for flattened sessions and creates JSON RPC Request object and unwraps Response.
 *
 * @param attach
 */
export default function newAttachProtocolTransport<SessionId>(
  attach: AttachJsonRpcTransport,
): AttachProtocolTransport<SessionId> {
  return (onEvent, onError, onClose) => {
    const [sendRequest, raceClose] = attach(onNotification, onError, onClose);
    const [attachSession, detachSession, dispatchEvent] = newSessions<
      SessionId
    >(send, raceClose);

    return [attachSession, detachSession, send, raceClose];

    function onNotification(notification: Notification): void {
      const { method, params, sessionId } = notification;
      if (sessionId === undefined) {
        onEvent(method, params);
      } else {
        dispatchEvent(sessionId as SessionId, method, params);
      }
    }

    async function send<
      Method extends string,
      Params extends object,
      Result extends object
    >(
      method: Method,
      params?: Params,
      raceCancellation?: RaceCancellation,
      sessionId?: SessionId,
    ): Promise<Result> {
      const request = {
        method,
        params,
        sessionId,
      };
      const response = await sendRequest<Method, Params, Result>(
        request,
        raceCancellation,
      );
      if ("error" in response) {
        throw newProtocolError(request, response);
      }
      return response.result;
    }
  };
}
