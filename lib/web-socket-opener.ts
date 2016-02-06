import { Disposable, eventPromise } from "./common";
import * as WebSocket from "ws";

export interface IWebSocketOpener {
  open(url: string, delegate: IWebSocketDelegate): Promise<IWebSocketConnection>;
}

export interface IWebSocketConnection extends Disposable {
}

export interface IWebSocketDelegate {
  socket: {
    send(data: string);
    close();
  };
  onMessage(data: string);
  onError(err: Error);
  onClose();
}

export default class WebSocketOpener implements IWebSocketOpener {
  open(url: string, delegate: IWebSocketDelegate): Promise<IWebSocketConnection> {
    return new Promise<IWebSocketConnection>(resolve => {
      let ws = new WebSocket(url);
      resolve(eventPromise(ws, "open", "error").then(() => {
        delegate.socket = ws;
        ws.on("message", data => delegate.onMessage(data));
        ws.on("error", err => delegate.onError(err));
        ws.on("close", () => delegate.onClose());
        return new WebSocketConnection(ws);
      }));
    });
  }
}

class WebSocketConnection implements IWebSocketConnection {
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
