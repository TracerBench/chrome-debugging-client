# @tracerbench/websocket-message-transport

Adapts the `ws` node module into a message transport.

```ts
export default async function openWebSocket(
  url: string,
  raceCancellation?: RaceCancellation,
): Promise<[AttachMessageTransport, CloseWebSocket]>
```
