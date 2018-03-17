import * as WebSocket from "ws";
import { eventPromise } from "./event-promise";
import { IWebSocketConnection, IWebSocketDelegate } from "./types";

export default async function openWebSocket(
  url: string,
  delegate: IWebSocketDelegate,
): Promise<IWebSocketConnection> {
  const ws = new WebSocket(url);
  await eventPromise(ws, "open", "error");

  const onMessage = delegate.onMessage.bind(delegate);
  const onError = delegate.onError.bind(delegate);

  ws.addListener("message", onMessage);
  ws.addListener("error", onError);

  function removeListeners() {
    ws.removeListener("message", onMessage);
    ws.removeListener("error", onError);
  }

  const closed = new Promise(resolveClose => {
    const onClose = () => {
      ws.removeListener("close", onClose);
      resolveClose();
    };
    ws.addListener("close", onClose);
  }).then(() => {
    removeListeners();
    delegate.onClose();
  });

  function close() {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  }

  async function dispose() {
    close();
    await closed;
  }

  function send(data: string) {
    ws.send(data);
  }

  return (delegate.socket = { send, close, dispose });
}
