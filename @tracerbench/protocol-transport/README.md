# @tracerbench/protocol-transport

Adapts a `AttachMessageTransport` function defined in `@tracerbench/message-transport` into
an `AttachProtocolTransport<SessionId>` function which is used to create a send function.

```ts
export type AttachProtocolTransport<SessionId> = (
  onEvent: OnEvent,
  onError: OnError,
  onClose: OnClose,
) => [
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
```

