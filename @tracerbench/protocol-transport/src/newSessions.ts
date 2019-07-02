import {
  cancellableRace,
  combineRaceCancellation,
  RaceCancellation,
} from "race-cancellation";

import {
  AttachProtocolTransport,
  AttachSession,
  DetachSession,
} from "../types";

export type DispatchEvent<SessionId> = (
  sessionId: SessionId,
  event: string,
  params: any,
) => void;

interface Session {
  onEvent: (event: string, params: any) => void;
  onError: (error: Error) => void;
  onDetach: () => void;
}

export type Send<SessionId> = <
  Method extends string,
  Params extends object,
  Result extends object
>(
  method: Method,
  params?: Params,
  raceCancellation?: RaceCancellation,
  sessionId?: SessionId,
) => Promise<Result>;

export default function newSessions<SessionId>(
  send: Send<SessionId>,
  raceClose: RaceCancellation,
): [
  AttachSession<SessionId>,
  DetachSession<SessionId>,
  DispatchEvent<SessionId>
] {
  let sessions: Map<SessionId, Session> | undefined;

  return [attachSession, detachSession, dispatchEvent];

  function attachSession(
    sessionId: SessionId,
  ): AttachProtocolTransport<SessionId> {
    return (
      onEvent: (event: string, params: any) => void,
      onError: (err: Error) => void,
      onDetach: () => void,
    ) => {
      if (sessions === undefined) {
        sessions = new Map();
      }
      const [raceDetach, cancel] = cancellableRace();
      sessions.set(sessionId, {
        onDetach() {
          cancel(`session detached ${sessionId}`);
          onDetach();
        },
        onError,
        onEvent,
      });
      return [
        attachSession,
        detachSession,
        (method, params, raceCancellation) => {
          return send(
            method,
            params,
            // send is already raced against close
            combineRaceCancellation(raceDetach, raceCancellation),
            sessionId,
          );
        },
        combineRaceCancellation(raceClose, raceDetach),
      ];
    };
  }

  function detachSession(sessionId: SessionId) {
    if (sessions === undefined) {
      return;
    }
    const session = sessions.get(sessionId);
    if (session !== undefined) {
      sessions.delete(sessionId);
      session.onDetach();
    }
  }

  function dispatchEvent(sessionId: SessionId, event: string, params: any) {
    if (sessions === undefined) {
      return;
    }
    const session = sessions.get(sessionId);
    if (session !== undefined) {
      try {
        session.onEvent(event, params);
      } catch (err) {
        session.onError(err);
      }
    }
  }
}
