import Protocol from "devtools-protocol";

import {
  SessionConnection,
  SessionID,
  SessionIdentifier,
  TargetID,
  TargetInfo,
} from "../types";

const CONNECTION = Symbol("connection");

export type NewConnection = (session: Session) => SessionConnection;
export type DestroyConnection = (sessionId: SessionID) => void;

export type EventHook = (event: string, params?: any) => void;
export interface GetConnection {
  (session: SessionIdentifier, throwIfNotAttached?: true): SessionConnection;
  (session: SessionIdentifier, throwIfNotAttached: boolean | undefined):
    | SessionConnection
    | undefined;
}
export type ClearSessions = () => void;

export interface Session {
  sessionId: SessionID;
  targetId: TargetID;
  targetInfo: TargetInfo;
}

interface Attachment {
  sessionId: SessionID;
  targetId: TargetID;
  targetInfo: TargetInfo;
  [CONNECTION]: SessionConnection | undefined;
}

export default function newEventHook(
  newConnection: NewConnection,
  detachConnection: DestroyConnection,
): [EventHook, GetConnection, ClearSessions] {
  let attachments: Map<SessionID, Attachment> | undefined;
  let sessionIds: Map<TargetID, SessionID> | undefined;

  return [eventHook, getConnection, clearSessions];

  function eventHook(event: string, params?: any) {
    switch (event) {
      case "Target.attachedToTarget":
        attachedToTarget(params);
        break;
      case "Target.detachedFromTarget":
        detachedFromTarget(params);
        break;
      case "Target.targetInfoChanged":
        targetInfoChanged(params);
        break;
    }
  }

  function getSessionId(session: SessionIdentifier, throwIfNotAttached = true) {
    let sessionId: SessionID | undefined;
    if (typeof session === "string") {
      sessionId = session;
    } else if (
      sessionIds !== undefined &&
      session !== null &&
      typeof session === "object"
    ) {
      if ("sessionId" in session) {
        sessionId = session.sessionId;
      } else if ("targetId" in session) {
        const { targetId } = session;
        sessionId = sessionIds.get(session.targetId);
        if (!sessionId && throwIfNotAttached) {
          throw new Error(`Target ${targetId} is not attached.`);
        }
      }
    }
    return sessionId;
  }

  function getSession(session: SessionIdentifier, throwIfNotAttached = true) {
    const sessionId = getSessionId(session, throwIfNotAttached);
    if (sessionId === undefined) {
      return;
    }

    if (attachments !== undefined) {
      const attachment = attachments.get(sessionId);
      if (attachment !== undefined) {
        return attachment;
      }
    }

    if (throwIfNotAttached) {
      throw new Error(`Session ${sessionId} is no longer attached.`);
    }
  }

  function attachedToTarget({
    sessionId,
    targetInfo,
  }: Protocol.Target.AttachedToTargetEvent) {
    const { targetId } = targetInfo;
    if (attachments === undefined) {
      attachments = new Map();
    }
    // we make the connection lazily
    attachments.set(sessionId, {
      [CONNECTION]: undefined,
      sessionId,
      targetId,
      targetInfo,
    });
    if (sessionIds === undefined) {
      sessionIds = new Map();
    }
    sessionIds.set(targetId, sessionId);
  }

  function detachedFromTarget({
    sessionId,
  }: Protocol.Target.DetachedFromTargetEvent) {
    if (attachments === undefined) {
      return;
    }
    const attachment = attachments.get(sessionId);
    if (attachment !== undefined) {
      attachments.delete(sessionId);
      if (sessionIds !== undefined) {
        sessionIds.delete(attachment.targetId);
      }
      if (attachment[CONNECTION] !== undefined) {
        attachment[CONNECTION] = undefined;
        detachConnection(sessionId);
      }
    }
  }

  function targetInfoChanged({
    targetInfo,
  }: Protocol.Target.TargetInfoChangedEvent) {
    const attachment = getSession(targetInfo, false);
    if (attachment !== undefined) {
      attachment.targetInfo = targetInfo;
    }
  }

  function getConnection(session: SessionIdentifier): SessionConnection;
  function getConnection(
    session: SessionIdentifier,
    throwIfNotAttached?: true,
  ): SessionConnection;
  function getConnection(
    session: SessionIdentifier,
    throwIfNotAttached: boolean | undefined,
  ): SessionConnection | undefined;
  function getConnection(
    session: SessionIdentifier,
    throwIfNotAttached = true,
  ) {
    const attachment = getSession(session, throwIfNotAttached);
    if (attachment === undefined) {
      return;
    }
    let connection = attachment[CONNECTION];
    if (connection === undefined) {
      connection = newConnection(attachment);
      attachment[CONNECTION] = connection;
    }
    return connection;
  }

  function clearSessions() {
    if (attachments !== undefined) {
      for (const attachment of attachments.values()) {
        if (attachment[CONNECTION] !== undefined) {
          attachment[CONNECTION] = undefined;
          detachConnection(attachment.sessionId);
        }
      }
      attachments.clear();
    }
    if (sessionIds !== undefined) {
      sessionIds.clear();
    }
  }
}
