import Protocol from "devtools-protocol";
import { ProtocolMapping } from "devtools-protocol/types/protocol-mapping";
import { RaceCancellation } from "race-cancellation";

export type TargetID = Protocol.Target.TargetID;
export type TargetInfo = Protocol.Target.TargetInfo;
export type SessionID = Protocol.Target.SessionID;

export type Method = keyof ProtocolMapping.Commands;
export type Event = keyof ProtocolMapping.Events | "error" | "detached";

export type EventMapping = {
  [E in keyof ProtocolMapping.Events]: ProtocolMapping.Events[E] extends [
    (infer T)?
  ]
    ? T
    : never
} & {
  error: Error;
};

export type RequestMapping = {
  [M in Method]: ProtocolMapping.Commands[M]["paramsType"] extends [(infer T)?]
    ? T
    : never
};

export type ResponseMapping = {
  [M in Method]: ProtocolMapping.Commands[M]["returnType"]
};

export type VoidRequestMethod = {
  [M in Method]: ProtocolMapping.Commands[M]["paramsType"] extends []
    ? M
    : never
}[Method];

export type MappedRequestMethod = {
  [M in Method]: ProtocolMapping.Commands[M]["paramsType"] extends [infer T]
    ? M
    : never
}[Method];

export type MaybeMappedRequestMethod = Exclude<
  Method,
  VoidRequestMethod | MappedRequestMethod
>;

export type VoidResponseMethod = {
  [M in Method]: ProtocolMapping.Commands[M]["returnType"] extends void
    ? M
    : never
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
        : never
    }[keyof ProtocolMapping.Events]
  | "detached";

export type MappedEvent = Exclude<Event, VoidEvent> | "error";

export interface ProtocolConnection {
  readonly isDetached: boolean;
  readonly raceDetached: RaceCancellation;

  readonly sessionId?: SessionID;
  readonly targetId?: TargetID;
  readonly targetInfo?: TargetInfo;

  /**
   * Get a connection for a currently attached session.
   *
   * If the session is not attached this will return undefined.
   */
  connection(
    sessionId: SessionID | { sessionId: SessionID } | { targetId: TargetID },
  ): ProtocolConnection | undefined;

  /**
   * Cancellable send a request and wait for response. This
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
   * @param request the method's params
   * @param raceCancellation
   * @returns a promise of the method's result.
   */
  send<M extends MappedRequestMethod>(
    method: M,
    request: RequestMapping[M],
    raceCancellation?: RaceCancellation,
  ): Promise<ResponseMapping[M]>;

  /**
   * Cancellable send a request and wait for response. This
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
   * @param request the method's params
   * @param raceCancellation
   * @returns a promise of the method's result.
   */
  send<M extends MaybeMappedRequestMethod>(
    method: M,
    request?: RequestMapping[M],
    raceCancellation?: RaceCancellation,
  ): Promise<ResponseMapping[M]>;

  /**
   * Cancellable send a request and wait for response. This
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
   * @param raceCancellation
   * @returns a promise of the method's result.
   */
  send<M extends VoidRequestMappedResponseMethod>(
    method: M,
    request?: undefined,
    raceCancellation?: RaceCancellation,
  ): Promise<ResponseMapping[M]>;

  /**
   * Cancellable send a request and wait for response. This
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
   * @param raceCancellation
   * @returns a promise of the method completion.
   */
  send(
    method: VoidRequestVoidResponseMethod,
    request?: undefined,
    raceCancellation?: RaceCancellation,
  ): Promise<void>;

  on<E extends MappedEvent>(
    event: E,
    listener: (event: EventMapping[E]) => void,
  ): void;
  on(event: VoidEvent, listener: () => void): void;

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
   * Cancellable promise of an event.
   *
   * See documentation of DevTools API for documentation of events
   * https://chromedevtools.github.io/devtools-protocol/tot
   *
   * Event types are provided by the devtools-protocol peer dependency.
   *
   * @param event the name of the event
   * @param predicate test event whether to resolve the until
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
   * @param raceCancellation additional cancellation concern, until already races against detachment.
   */
  until(
    event: VoidEvent,
    predicate?: undefined,
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
