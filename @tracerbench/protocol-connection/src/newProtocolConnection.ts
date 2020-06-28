import {
  combineRaceCancellation,
  disposablePromise,
  throwIfCancelled,
} from "race-cancellation";

import type {
  AttachProtocolTransport,
  AttachSession,
  NewEventEmitter,
  Protocol,
  ProtocolConnection,
  RaceCancellation,
  RootConnection,
  SessionConnection,
  SessionID,
  TargetID,
} from "../types";
import type { Session } from "./newEventHook";
import newEventHook from "./newEventHook";

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
): RootConnection {
  return newProtocolConnection(attach, newEventEmitter);
}

function newSessionConnection(
  attachSession: AttachSession<SessionID>,
  newEventEmitter: NewEventEmitter,
  session: Session,
): SessionConnection {
  return newProtocolConnection(
    attachSession(session.sessionId),
    newEventEmitter,
    session,
  );
}

function newProtocolConnection(
  attachTransport: AttachProtocolTransport<SessionID>,
  newEventEmitter: NewEventEmitter,
  session: Session,
): SessionConnection;
function newProtocolConnection(
  attachTransport: AttachProtocolTransport<SessionID>,
  newEventEmitter: NewEventEmitter,
): RootConnection;
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

  const base: RootConnection = {
    attachToTarget,
    connection,
    off: emitter.removeListener.bind(emitter),
    on: emitter.on.bind(emitter),
    once: emitter.once.bind(emitter),
    raceDetached,
    removeAllListeners: emitter.removeAllListeners.bind(emitter),
    removeListener: emitter.removeListener.bind(emitter),
    send,
    setAutoAttach,
    until,
    get isDetached() {
      return isDetached;
    },
  };

  if (session !== undefined) {
    return Object.create(base, {
      sessionId: {
        get: () => session.sessionId,
      },
      targetId: {
        get: () => session.targetId,
      },
      targetInfo: {
        get: () => session.targetInfo,
      },
    }) as SessionConnection;
  }

  return base;

  async function attachToTarget(
    targetId: TargetID | { targetId: TargetID },
    raceCancellation?: RaceCancellation,
  ): Promise<SessionConnection> {
    if (typeof targetId === "object" && targetId !== null) {
      targetId = targetId.targetId;
    }
    const request = { flatten: true, targetId };
    const conn = connection(request, false);
    if (conn !== undefined) {
      return conn;
    }
    const resp: Protocol.Target.AttachToTargetResponse = await send(
      "Target.attachToTarget",
      request,
      raceCancellation,
    );
    return connection(resp);
  }

  async function setAutoAttach(
    autoAttach: boolean,
    waitForDebuggerOnStart = false,
    raceCancellation?: RaceCancellation,
  ): Promise<void> {
    const request: Protocol.Target.SetAutoAttachRequest = {
      autoAttach,
      flatten: true,
      waitForDebuggerOnStart,
    };
    await send("Target.setAutoAttach", request, raceCancellation);
  }

  function onEvent(event: string, params?: object): void {
    eventHook(event, params);
    emitter.emit(event, params);
  }

  function onError(error: Error): void {
    emitter.emit("error", error);
  }

  function onDetached(): void {
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
  ): Promise<Event> {
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
