import {
  AttachProtocolTransport,
  AttachSession,
} from "@tracerbench/protocol-transport";
import {
  combineRaceCancellation,
  disposablePromise,
  RaceCancellation,
  throwIfCancelled,
} from "race-cancellation";
import { NewEventEmitter, ProtocolConnection, SessionID } from "../types";
import newEventHook, { Session } from "./newEventHook";

/**
 * This method adapts a AttachProtocolTransport into higher level
 * ProtocolConnection.
 *
 * @param connect
 * @param newEventEmitter
 */
export default function newRootConnection(
  attach: AttachProtocolTransport<SessionID>,
  newEventEmitter: NewEventEmitter,
): ProtocolConnection {
  return newProtocolConnection(attach, newEventEmitter);
}

function newSessionConnection(
  attachSession: AttachSession<SessionID>,
  newEventEmitter: NewEventEmitter,
  session: Session,
) {
  return newProtocolConnection(
    attachSession(session.sessionId),
    newEventEmitter,
    session,
  );
}

function newProtocolConnection(
  attachTransport: AttachProtocolTransport<SessionID>,
  newEventEmitter: NewEventEmitter,
  session?: Session,
): ProtocolConnection {
  const emitter = newEventEmitter();

  let isDetached = false;

  const [
    onTargetAttached,
    onTargetDetached,
    send,
    raceDetached,
  ] = attachTransport(onEvent, onError, onDetached);

  const [eventHook, connection, clearSessions] = newEventHook(
    newSessionConnection.bind(null, onTargetAttached, newEventEmitter),
    onTargetDetached,
  );

  return {
    connection,
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    raceDetached,
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
    send,
    until,
    get isDetached() {
      return isDetached;
    },
    get targetId() {
      if (session !== undefined) {
        return session.targetId;
      }
    },
    get sessionId() {
      if (session !== undefined) {
        return session.sessionId;
      }
    },
    get targetInfo() {
      if (session !== undefined) {
        return session.targetInfo;
      }
    },
  };

  function onEvent(event: string, params: any) {
    eventHook(event, params);
    emitter.emit(event, params);
  }

  function onError(error: Error) {
    emitter.emit("error", error);
  }

  function onDetached() {
    if (isDetached) {
      return;
    }
    isDetached = true;

    // in practice it chrome notifies child sessions before
    // parent session but just in case we clear here
    clearSessions();

    emitter.emit("detached");
  }

  async function until<Event>(
    eventName: string,
    predicate?: (event: Event) => boolean,
    raceCancellation?: RaceCancellation,
  ) {
    return throwIfCancelled(
      await disposablePromise<Event>((resolve, reject) => {
        const listener =
          predicate === undefined
            ? resolve
            : (event: Event) => {
                try {
                  if (predicate(event)) {
                    resolve(event);
                  }
                } catch (e) {
                  reject(e);
                }
              };
        emitter.on(eventName, listener);
        return () => {
          emitter.removeListener(eventName, listener);
        };
      }, combineRaceCancellation(raceDetached, raceCancellation)),
    );
  }
}
