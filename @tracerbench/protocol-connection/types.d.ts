import type {
  AttachJsonRpcTransport,
  AttachMessageTransport,
  AttachProtocolTransport,
  AttachSession,
  Cancellation,
  DebugCallback,
  DetachSession,
  ErrorResponse,
  Notification,
  OnClose,
  OnError,
  OnEvent,
  OnMessage,
  OnNotification,
  ProtocolError,
  ProtocolTransport,
  RaceCancellation,
  Request,
  Response,
  ResponseError,
  SendMessage,
  SendMethod,
  SendRequest,
  SuccessResponse,
  Task,
} from "@tracerbench/protocol-transport";
import type { Protocol } from "devtools-protocol";
import type { ProtocolMapping } from "devtools-protocol/types/protocol-mapping";

export type {
  AttachJsonRpcTransport,
  AttachMessageTransport,
  AttachProtocolTransport,
  AttachSession,
  Cancellation,
  DebugCallback,
  DetachSession,
  ErrorResponse,
  Notification,
  OnClose,
  OnError,
  OnEvent,
  OnMessage,
  OnNotification,
  Protocol,
  ProtocolMapping,
  ProtocolError,
  ProtocolTransport,
  RaceCancellation,
  Request,
  Response,
  ResponseError,
  SendMessage,
  SendMethod,
  SendRequest,
  SuccessResponse,
  Task,
};

export type ProtocolConnection = SessionConnection | RootConnection;

export interface SessionConnection extends ProtocolConnectionBase {
  readonly sessionId: SessionID;
  readonly targetId: TargetID;
  readonly targetInfo: TargetInfo;
}

export interface RootConnection extends ProtocolConnectionBase {
  readonly sessionId?: undefined;
  readonly targetId?: undefined;
  readonly targetInfo?: undefined;
}

export interface ProtocolConnectionBase {
  /**
   * Whether the connection is still attached.
   */
  readonly isDetached: boolean;

  /**
   * Use to race an async task against the connection detaching.
   */
  readonly raceDetached: RaceCancellation;

  /**
   * Get a connection for a currently attached session.
   *
   * If the session is not attached this will throw.
   *
   * Should be used with Target.attachToTarget or Target.createTarget
   *
   * @param sessionId the session id or a obj with a sessionId or a targetId
   */
  connection(
    sessionId: SessionIdentifier,
    throwIfNotAttached?: true,
  ): SessionConnection;

  /**
   * Get a connection for a currently attached session.
   *
   * If throwIfNotAttached is undefined or true, it will throw if session is not attached,
   * otherwise it returns undefined.
   *
   * @param sessionId the session id or a obj with a sessionId or a targetId
   * @param throwIfNotAttached whether to throw if session is not attached, defaults to true.
   */
  connection(
    sessionId: SessionIdentifier,
    throwIfNotAttached: boolean | undefined,
  ): SessionConnection | undefined;

  /**
   * Attaches to a target and returns the SessionConnection, if the target is already attached,
   * it returns the existing SessionConnection.
   *
   * This is a convenience for ensuring that flattened sessions are used it is the same as
   * ```js
   * conn.connection(await conn.send("Target.attachToTarget", { targetId, flatten: true }));
   * ```
   *
   * You can either use with Target.createTarget or the Target.setDiscoverTargets method and
   * Target.targetCreated events.
   *
   * https://chromedevtools.github.io/devtools-protocol/tot/Target#method-attachToTarget
   */
  attachToTarget(
    targetId: TargetID | { targetId: TargetID },
    raceCancellation?: RaceCancellation,
  ): Promise<SessionConnection>;

  /**
   * This will cause Target.attachedToTarget events to fire for related targets.
   *
   * This is a convenience for ensuring that flattened sessions are used it is the same as
   *
   * ```js
   * await conn.send("Target.setAutoAttach", { autoAttach, waitForDebuggerOnStart, flatten: true });
   * ```
   * https://chromedevtools.github.io/devtools-protocol/tot/Target#method-setAutoAttach
   *
   * You suscribe to the Target.attachedToTarget event and use the connection method to get
   * the connection for the attached session. If it isn't a target you are interested in
   * you must detach from it or it will stay alive until you set auto attach to false. This
   * can be an issue with testing service workers.
   *
   * ```js
   * conn.on("Target.attachedToTarget", event => {
   *    const session = conn.connection(event);
   * })
   * ```
   *
   * @param autoAttach auto attach flag
   * @param waitForDebuggerOnStart whether the debugger should wait target to be attached.
   */
  setAutoAttach(
    autoAttach: boolean,
    waitForDebuggerOnStart?: boolean,
    raceCancellation?: RaceCancellation,
  ): Promise<void>;

  /**
   * Cancellable send of a request and wait for response. This
   * already races against closing the connection but you can
   * pass in another raceCancellation concern like a timeout.
   *
   * See documentation of DevTools API for documentation of methods
   * https://chromedevtools.github.io/devtools-protocol/tot
   *
   * The request and reponse types are provide by the devtools-protocol
   * peer dependency.
   *
   * @param method the DevTools API method
   * @param request required request parameters
   * @param raceCancellation
   * @returns a promise of the method's result.
   */
  send<M extends MappedRequestMethod>(
    method: M,
    request: RequestMapping[M],
    raceCancellation?: RaceCancellation,
  ): Promise<ResponseMapping[M]>;

  /**
   * Cancellable send of a request and wait for response. This
   * already races against closing the connection but you can
   * pass in another raceCancellation concern like a timeout.
   *
   * See documentation of DevTools API for documentation of methods
   * https://chromedevtools.github.io/devtools-protocol/tot
   *
   * The request and reponse types are provide by the devtools-protocol
   * peer dependency.
   *
   * @param method the DevTools API method
   * @param request optional request parameters
   * @param raceCancellation
   * @returns a promise of the method's result.
   */
  send<M extends MaybeMappedRequestMethod>(
    method: M,
    request?: RequestMapping[M],
    raceCancellation?: RaceCancellation,
  ): Promise<ResponseMapping[M]>;

  /**
   * Cancellable send of a request and wait for response. This
   * already races against session detached/transport close
   * but you can pass in another raceCancellation concern
   * like a timeout.
   *
   * See documentation of DevTools API for documentation of methods
   * https://chromedevtools.github.io/devtools-protocol/tot
   *
   * The request and reponse types are provide by the devtools-protocol
   * peer dependency.
   *
   * @param method the DevTools API method
   * @param request this request takes no params or empty pojo
   * @param raceCancellation
   * @returns a promise of the method's result.
   */
  send<M extends VoidRequestMappedResponseMethod>(
    method: M,
    request?: object,
    raceCancellation?: RaceCancellation,
  ): Promise<ResponseMapping[M]>;

  /**
   * Cancellable send of a request and wait for response. This
   * already races against session detached/transport close
   * but you can pass in another raceCancellation concern
   * like a timeout.
   *
   * See documentation of DevTools API for documentation of methods
   * https://chromedevtools.github.io/devtools-protocol/tot
   *
   * The request and reponse types are provide by the devtools-protocol
   * peer dependency.
   *
   * @param method the DevTools API method
   * @param request this request takes no params or empty pojo
   * @param raceCancellation
   * @returns a promise of the method completion.
   */
  send(
    method: VoidRequestVoidResponseMethod,
    request?: undefined,
    raceCancellation?: RaceCancellation,
  ): Promise<void>;

  /**
   * Subscribe to an event.
   * @param event name of event
   * @param listener callback with event object
   */
  on<E extends MappedEvent>(
    event: E,
    listener: (event: EventMapping[E]) => void,
  ): void;

  /**
   * Subscribe to an event.
   * @param event name of event
   * @param listener void callback
   */
  on(event: VoidEvent, listener: () => void): void;

  off<E extends MappedEvent>(
    event: E,
    listener: (event: EventMapping[E]) => void,
  ): void;
  off(event: VoidEvent, listener: () => void): void;

  once<E extends MappedEvent>(
    event: E,
    listener: (event: EventMapping[E]) => void,
  ): void;
  once(event: VoidEvent, listener: () => void): void;

  removeListener<E extends MappedEvent>(
    event: E,
    listener: (event: EventMapping[E]) => void,
  ): void;
  removeListener(event: VoidEvent, listener: () => void): void;

  removeAllListeners(event?: Event): void;

  /**
   * Cancellable promise of an event with an optional predicate function
   * to check whether the event is the one you are waiting for.
   *
   * See documentation of DevTools API for documentation of events
   * https://chromedevtools.github.io/devtools-protocol/tot
   *
   * Event types are provided by the devtools-protocol peer dependency.
   *
   * @param event the name of the event
   * @param predicate optional callback to test event object whether to resolve the until
   * @param raceCancellation additional cancellation concern, until already races against session detached/transport close.
   */
  until<E extends MappedEvent>(
    event: E,
    predicate?: EventPredicate<EventMapping[E]>,
    raceCancellation?: RaceCancellation,
  ): Promise<EventMapping[E]>;

  /**
   * Cancellable promise of an event.
   *
   * See documentation of DevTools API for documentation of events
   * https://chromedevtools.github.io/devtools-protocol/tot
   *
   * @param event the name of the event
   * @param predicate this event doesn't have an object so this will be undefined
   * @param raceCancellation additional cancellation concern, until already races against detachment.
   */
  until(
    event: VoidEvent,
    predicate?: () => boolean,
    raceCancellation?: RaceCancellation,
  ): Promise<void>;
}

export type EventListener = (...args: any[]) => void;

export interface EventEmitter {
  on(event: string, listener: EventListener): void;
  once(event: string, listener: EventListener): void;
  removeListener(event: string, listener: EventListener): void;
  removeAllListeners(event?: string): void;
  emit(event: string, ...args: any[]): void;
}

export type EventPredicate<Event> = (event: Event) => boolean;

export type NewEventEmitter = () => EventEmitter;

export type TargetID = Protocol.Target.TargetID;
export type TargetInfo = Protocol.Target.TargetInfo;
export type SessionID = Protocol.Target.SessionID;

export type Method = keyof ProtocolMapping.Commands;
export type Event = keyof ProtocolMapping.Events | "error" | "detached";

export type EventMapping = {
  [E in keyof ProtocolMapping.Events]: ProtocolMapping.Events[E] extends [
    (infer T)?,
  ]
    ? T
    : never;
} & {
  error: Error;
};

export type RequestMapping = {
  [M in Method]: ProtocolMapping.Commands[M]["paramsType"] extends [(infer T)?]
    ? T
    : never;
};

export type ResponseMapping = {
  [M in Method]: ProtocolMapping.Commands[M]["returnType"];
};

export type VoidRequestMethod = {
  [M in Method]: ProtocolMapping.Commands[M]["paramsType"] extends []
    ? M
    : never;
}[Method];

export type MappedRequestMethod = {
  [M in Method]: ProtocolMapping.Commands[M]["paramsType"] extends [infer T]
    ? M
    : never;
}[Method];

export type MaybeMappedRequestMethod = Exclude<
  Method,
  VoidRequestMethod | MappedRequestMethod
>;

export type VoidResponseMethod = {
  [M in Method]: ProtocolMapping.Commands[M]["returnType"] extends void
    ? M
    : never;
}[Method];

export type MappedResponseMethod = Exclude<Method, VoidResponseMethod>;

export type VoidRequestVoidResponseMethod = Extract<
  MaybeMappedRequestMethod | VoidRequestMethod,
  VoidResponseMethod
>;
export type VoidRequestMappedResponseMethod = Exclude<
  MaybeMappedRequestMethod | VoidRequestMethod,
  VoidRequestVoidResponseMethod
>;

export type VoidEvent =
  | {
      [E in keyof ProtocolMapping.Events]: ProtocolMapping.Events[E] extends []
        ? E
        : never;
    }[keyof ProtocolMapping.Events]
  | "detached";

export type MappedEvent = Exclude<Event, VoidEvent> | "error";
export type SessionIdentifier =
  | SessionID
  | {
      targetId: TargetID;
    }
  | {
      sessionId: SessionID;
    };
