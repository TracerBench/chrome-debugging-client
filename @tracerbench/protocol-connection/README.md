# @tracerbench/protocol-connection

Adapts a message transport into a [devtools protocol](https://chromedevtools.github.io/devtools-protocol/) connection.

This peer depends on `devtools-protocol` which defines the typing of events, requests, and responses of the devtools protocol.

## API

```ts
export default function newProtocolConnection(
  attach: AttachMessageTransport,
  newEventEmitter: NewEventEmitter,
  debug: DebugCallback,
): ProtocolConnection;
```

The types are declared in [types.d.ts](types.d.ts)
