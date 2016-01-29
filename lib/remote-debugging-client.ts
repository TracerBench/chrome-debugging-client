import * as WebSocket from "ws";
import { EventEmitter } from "events";


interface SuccessMessage<T> {
  id: number;
  result: T;
}

interface ErrorMessage {
  id: number;
  error: {
    code: number;
    message: string;
  };
}

interface NotificationMessage<T> {
  method: string;
  params: T;
}

interface CommandCallback<T> {
  (message: SuccessMessage<T> & ErrorMessage): void;
}

class CommandError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }
}

export default class RemoteDebuggingClient extends EventEmitter {
  private commands: CommandCallback<any>[] = [];
  private ws: WebSocket;
  private open: Promise<any>;

  constructor(url: string) {
    super();
    let ws = this.ws = new WebSocket(url);
    this.open = new Promise((resolve, reject) => {
      ws.once("open", resolve);
      ws.once("error", reject);
    });
    ws.on("message", (data, flags) => {
      this.handleMessage(data);
    });
  }

  private handleMessage(data: string) {
    let m = <SuccessMessage<any> & ErrorMessage & NotificationMessage<any>>JSON.parse(data);
    if (typeof m.id === "number") {
      this.commands[m.id](m);
      this.commands[m.id] = undefined;
    } else {
      console.log(m.method);
      this.emit(m.method, m.params);
    }
  }

  sendCommand<T, U>(method: string, params: T): Promise<U> {
    return this.open.then(() => new Promise<U>((resolve, reject) => {
      let id = this.commands.length;
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
      let callback: CommandCallback<U> = (m) => {
        cleanup();
        if (m.error) {
          reject(new CommandError(m.error.code, m.error.message));
        }
        resolve(m.result);
      }
      this.commands.push(callback);
      this.ws.on("error", onerror);
      this.ws.on("close", onclose);
      this.ws.send(message);
    }));
  }
}