import { EventNotifier } from "./common";
import { IWebSocketDelegate } from "./web-socket-opener";
import { EventEmitter } from "events";

export interface IDebuggingProtocolClientFactory {
  create();
}

export interface IDebuggingProtocolClient extends EventNotifier, IWebSocketDelegate {
  send<T>(command: string, params?: any): Promise<T>;
  send(command: string, params?: any): Promise<any>;
}

interface CommandRequest {
  id: number;
  method: string;
  params: string;
  resolve: (res: CommandResponseMessage) => void;
  reject: (reason: any) => void;
}

interface EventMessage {
  method: string;
  params: any;
}

interface SuccessResponseMessage {
  id: number;
  result: any;
}

interface ErrorResponseMessage {
  id: number;
  error: {
    code: number;
    message: string;
  };
}

interface Message extends EventMessage, SuccessResponseMessage, ErrorResponseMessage {}

interface CommandResponseMessage extends SuccessResponseMessage, ErrorResponseMessage {}

export default class DebuggingProtocolFactory implements IDebuggingProtocolClientFactory {
  create(): IDebuggingProtocolClient {
    return new DebuggingProtocol();
  }
}

class DebuggingProtocol extends EventEmitter implements IDebuggingProtocolClient {
  seq = 0;
  pendingRequests = new Map<number, CommandRequest>();
  socket: {
    send(data: string);
    close();
  };

  constructor() {
    super();
  }

  onMessage(data: string) {
    try {
      let msg: Message = JSON.parse(data);
      if (msg.id !== undefined) {
        let req = this.pendingRequests.get(msg.id);
        this.pendingRequests.delete(msg.id);
        req.resolve(msg);
      } else {
        this.emit(msg.method, msg.params);
      }
    } catch (err) {
      this.onError(err);
      this.socket.close();
    }
  }
  onClose() {
    this.clearPending(new Error("socket disconnect"));
    this.emit("close");
  }
  onError(err: Error) {
    this.clearPending(err);
    this.socket.close();
    this.emit("error", err);
  }
  clearPending(err: Error) {
    if (this.pendingRequests.size) {
      this.pendingRequests.forEach((req) => {
        req.reject(err);
      });
      this.pendingRequests.clear();
    }
  }
  send(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let id = this.seq++;
      this.socket.send(JSON.stringify({id, method, params}));
      this.pendingRequests.set(id, { id, method, params, resolve, reject });
    }).then((res: CommandResponseMessage) => {
      if (res.error) {
        throw new ProtocolError(res.error);
      }
      return res.result;
    });
  }
}

class ProtocolError extends Error {
  code: number;
  constructor(err: {
    code: number;
    message: string;
  }) {
    super(err.message);
    this.code = err.code;
  }
}
