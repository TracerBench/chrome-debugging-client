import * as WebSocket from "ws";
import { EventEmitter } from "events";
import { eventPromise } from "./utils";

interface SuccessMessageEvent<T> {
  id: number;
  result: T;
}

interface ErrorMessageEvent {
  id: number;
  error: {
    code: number;
    message: string;
  };
}

interface NotificationMessageEvent<T> {
  method: string;
  params: T;
}

interface MessageEvent extends ErrorMessageEvent, NotificationMessageEvent<any>, SuccessMessageEvent<any> {
}

interface CommandCallback<T> {
  (message: SuccessMessageEvent<T> & ErrorMessageEvent): void;
}

class CommandError extends Error {
  code: number;
  constructor(err: { code: number, message: string}) {
    super(err.message);
    this.code = err.code;
  }
}

export default class WebSocketClient extends EventEmitter {
  private commands: CommandCallback<any>[] = [];
  private ws: WebSocket;
  private open: Promise<void>;

  verbose: boolean;

  constructor(url: string) {
    super();
    let ws = this.ws = new WebSocket(url);
    this.open = eventPromise<void>(ws, "open", "error");
    ws.on("message", (data: string) => {
      try {
        this.handleMessage(<MessageEvent>JSON.parse(data));
      } catch (err) {
        this.emit("error", err);
      }
    });
    ws.on("open", () => this.emit("open"));
    ws.on("error", (err) => this.emit("error", err));
    ws.on("close", () => this.emit("close"));
  }

  private handleMessage(msg: MessageEvent) {
    if (typeof msg.id === "number") {
      if (this.verbose) {
        if (msg.error) {
          console.log("E", msg.error);
        } else {
          console.log("R", msg.id);
        }
      }
      // TODO make commands objects, reuse after acknowledge
      let callback = this.commands[msg.id];
      this.commands[msg.id] = undefined;
      callback(msg);
    } else {
      if (this.verbose) {
        console.log("N -", msg.method);
      }
      this.emit(msg.method, msg.params);
    }
  }

  async close(): Promise<void> {
    if (this.ws.readyState === WebSocket.CLOSED) {
      return;
    }
    this.ws.close();
    if (this.ws.readyState === WebSocket.CLOSING) {
      return eventPromise<void>(this.ws, "close", "error");
    }
  }

  send<T, U>(method: string, params: T): Promise<U> {
    return this.open.then(() => new Promise<U>((resolve, reject) => {
      let id = this.commands.length;
      if (this.verbose) {
        console.log("S", id, method);
      }
      let message = JSON.stringify({ id, method, params });
      let cleanup = () => {
        this.ws.removeListener("close", onclose);
        this.ws.removeListener("onerror", onerror);
      }
      let onclose = () => {
        cleanup();
        reject(new Error("closed before response"));
      };
      let onerror = (err: Error) => {
        cleanup();
        reject(err);
      }
      let callback: CommandCallback<U> = (evt) => {
        cleanup();
        if (evt.error) {
          reject(new CommandError(evt.error));
        }
        resolve(evt.result);
      }
      this.commands.push(callback);
      this.ws.on("error", onerror);
      this.ws.on("close", onclose);
      this.ws.send(message);
    }));
  }
}