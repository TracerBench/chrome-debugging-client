import { Disposable, eventPromise } from "./common";
import * as WebSocket from "ws";

export interface WebSocketOpener {
  open(url: string, delegate: WebSocketDelegate): Promise<WebSocketConnection>;
}

export interface WebSocketConnection extends Disposable {}

export interface WebSocketDelegate {
  socket: {
    send(data: string);
    close();
  };
  onMessage(data: string);
  onError(err: Error);
  onClose();
}

export default class WebSocketImpl implements WebSocketOpener {
  open(url: string, delegate: WebSocketDelegate): Promise<WebSocketConnection> {
    return new Promise<WebSocketConnection>(resolve => {
      let ws = new WebSocket(url);
      resolve(eventPromise(ws, "open", "error").then(() => {
        delegate.socket = ws;
        ws.on("message", data => delegate.onMessage(data));
        ws.on("error", err => delegate.onError(err));
        ws.on("close", () => delegate.onClose());
        return new WebSocketConnectionImpl(ws);
      }));
    });
  }
}

class WebSocketConnectionImpl implements WebSocketConnection {
  ws: WebSocket;
  constructor(ws: WebSocket) {
    this.ws = ws;
  }
  dispose(): Promise<any> {
    return new Promise(resolve => {
      let ws = this.ws;
      if (ws.readyState === WebSocket.CLOSED) {
        resolve();
      } else {
        ws.close();
        resolve(eventPromise(ws, "close", "error"));
      }
    }).catch(err => console.error(err));
  }
}
