import { AttachMessageTransport } from "@tracerbench/message-transport";
import {
  cancellableRace,
  combineRaceCancellation,
  RaceCancellation,
  throwIfCancelled,
} from "race-cancellation";
import newResponses from "./newResponses";

import {
  AttachJsonRpcTransport,
  DebugCallback,
  Notification,
  Request,
  Response,
} from "../types";

/**
 * Creates a AttachJsonRpcTransport function from the specified
 * AttachMessageTransport function.
 *
 * This just handles the JSON RPC part of adapting the message transport.
 *
 * It does not support all of JSON RPC, only whats needed for the DevTools API.
 * The client can only receive notifications and send requests.
 * The client cannot receive requests or send notifications.
 *
 * @param attach a function that attaches the message transport
 * @param debug an optional debug function, should support format string + args like npm debug
 */
export default function newAttachJsonRpcTransport(
  attach: AttachMessageTransport,
  debug: DebugCallback = () => void 0,
): AttachJsonRpcTransport {
  return (onNotifiction, onError, onClose) => {
    const [raceClose, cancel] = cancellableRace();
    const [usingResponse, resolveResponse] = newResponses();
    const sendMessage = attach(onMessage, error => {
      if (error !== undefined) {
        handleError(error);
      }
      handleClose();
    });
    return [sendRequest, raceClose];

    function onMessage(message: string): void {
      try {
        const notification: Notification | Response = JSON.parse(message);
        debug("RECV %O", notification);
        if (notification !== undefined) {
          if ("id" in notification) {
            resolveResponse(notification);
          } else {
            onNotifiction(notification);
          }
        }
      } catch (e) {
        handleError(e);
      }
    }

    function handleClose() {
      debug("CLOSE");
      cancel("transport closed");
      onClose();
    }

    function handleError(error: Error) {
      debug("ERROR %O", error);
      onError(error);
    }

    async function sendRequest<
      Method extends string,
      Params extends object,
      Result extends object
    >(
      request: Request<Method, Params, unknown>,
      raceCancellation?: RaceCancellation,
    ): Promise<Response<Result>> {
      const combinedRaceCancellation = combineRaceCancellation(
        raceClose,
        raceCancellation,
      );
      return await usingResponse<Result>(async (id, response) => {
        request.id = id;
        debug("SEND %O", request);
        sendMessage(JSON.stringify(request));
        return throwIfCancelled(await combinedRaceCancellation(response));
      });
    }
  };
}
