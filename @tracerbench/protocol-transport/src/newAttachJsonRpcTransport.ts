import { AttachMessageTransport } from "@tracerbench/message-transport";
import {
  cancellableRace,
  combineRaceCancellation,
  RaceCancellation,
  throwIfCancelled,
} from "race-cancellation";

import {
  AttachJsonRpcTransport,
  DebugCallback,
  Notification,
  Request,
  Response,
} from "../types";
import newResponses from "./newResponses";

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
 * @param raceCancellation a raceCancellation that is scoped to the transport like Chrome exited
 */
export default function newAttachJsonRpcTransport(
  attach: AttachMessageTransport,
  debug: DebugCallback = () => void 0,
  raceCancellation?: RaceCancellation,
): AttachJsonRpcTransport {
  return (onNotifiction, emitError, emitClose) => {
    const [_raceClose, cancel] = cancellableRace();

    const raceClose = combineRaceCancellation(raceCancellation, _raceClose);

    const [usingResponse, resolveResponse] = newResponses();
    const sendMessage = attach(onMessage, onClose);
    return [sendRequest, raceClose];

    function onMessage(message: string): void {
      try {
        const notification = JSON.parse(message) as Notification | Response;
        debug("RECV %O", notification);
        if (notification !== undefined) {
          if ("id" in notification) {
            resolveResponse(notification);
          } else {
            onNotifiction(notification);
          }
        }
      } catch (e) {
        debug("ERROR %O", e);
        emitError(e);
      }
    }

    function onClose(error?: Error): void {
      if (error) {
        debug("CLOSE %O", error);
        cancel(`transport closed: ${error.message}`);
      } else {
        debug("CLOSE");
        cancel("transport closed");
      }
      emitClose();
    }

    async function sendRequest<
      Method extends string,
      Params extends object,
      Result extends object
    >(
      request: Request<Method, Params, unknown>,
      sendRaceCancellation?: RaceCancellation,
    ): Promise<Response<Result>> {
      const combinedRaceCancellation = combineRaceCancellation(
        raceClose,
        sendRaceCancellation,
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
