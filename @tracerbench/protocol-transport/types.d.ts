import { Cancellation, RaceCancellation } from "race-cancellation";

export type AttachJsonRpcTransport = (
  onNotification: OnNotification,
  onError: OnError,
  onClose: OnClose,
) => [SendRequest, RaceCancellation];

export type SendRequest = <
  Method extends string,
  Params extends object,
  Result extends object
>(
  request: Request<Method, Params>,
  raceCancellation?: RaceCancellation,
) => Promise<Response<Result>>;

export type AttachProtocolTransport<SessionId> = (
  onEvent: OnEvent,
  onError: OnError,
  onClose: OnClose,
) => ProtocolTransport<SessionId>;

export type ProtocolTransport<SessionId> = [
  AttachSession<SessionId>,
  DetachSession<SessionId>,
  SendMethod<SessionId>,
  RaceCancellation
];

export type AttachSession<SessionId> = (
  sessionId: SessionId,
) => AttachProtocolTransport<SessionId>;

export type DetachSession<SessionId> = (sessionId: SessionId) => void;

export type SendMethod<SessionId> = <
  Method extends string,
  Params extends object,
  Result extends object
>(
  method: Method,
  params?: Params,
  raceCancellation?: RaceCancellation,
) => Promise<Result>;

export interface SuccessResponse<Result> {
  id: number;
  result: Result;
}

export interface ErrorResponse {
  id: number;
  error: ResponseError;
}

export interface ResponseError {
  code: number;
  message: string;
  data?: any;
}

export type Response<Result extends object | void = object | void> =
  | SuccessResponse<Result>
  | ErrorResponse;

export interface Request<
  Method extends string = string,
  Params extends object = object,
  SessionID = any
> {
  /**
   * The request gets assigned an id when it is sent.
   */
  id?: number;
  method: Method;
  params?: Params;

  /**
   * Flattened sessionId
   */
  sessionId?: SessionID;
}

export interface Notification<
  Method extends string = string,
  Params extends object = object,
  SessionID = any
> {
  method: Method;
  params?: Params;
  sessionId?: SessionID;
}

export type DebugCallback = (fmt: string, ...args: any[]) => void;

export interface ProtocolError<
  Method extends string = string,
  Params extends object = object
> extends Error {
  name: "ProtocolError";
  request: Request<Method, Params>;
  response: ErrorResponse;
}

export type OnNotification = <
  Method extends string = string,
  Params extends object = object
>(
  notification: Notification<Method, Params>,
) => void;
export type OnError = (error: Error) => void;
export type OnClose = () => void;
export type OnEvent = <
  Event extends string = string,
  Params extends object = object
>(
  event: Event,
  params?: Params,
) => void;
