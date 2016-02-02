import { EventNotifier } from "./common";
import { WebSocketDelegate } from "./web-socket-opener";
import { EventEmitter } from "events";

export interface DebuggingProtocolFactory {
  create();
}

export interface DebuggingProtocol extends EventNotifier, WebSocketDelegate {
  send<R, P>(command: string, params?: P): Promise<R>;
  send(command: string, params?: any): Promise<any>;
}

export default class DebuggingProtocolFactoryImpl implements DebuggingProtocolFactory {
  create(): DebuggingProtocol {
    return new DebuggingProtocolImpl();
  }
}

interface Request {
  id: number;
  method: string;
  params: string;
  resolve: (res: Response) => void;
  reject: (reason: any) => void;
}

class DebuggingProtocolImpl extends EventEmitter implements DebuggingProtocol {
  seq = 0;
  pendingRequests = new Map<number, Request>();
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
    }).then((res: Response) => {
      if (res.error) {
        throw new ProtocolError(res.error);
      }
      return res.result;
    });
  }
}

interface Event {
  method: string;
  params: any;
}

interface SuccessResponse {
  id: number;
  result: any;
}

interface ErrorResponse {
  id: number;
  error: {
    code: number;
    message: string;
  };
}

interface Message extends Event, SuccessResponse, ErrorResponse {}

interface Response extends SuccessResponse, ErrorResponse {}

class ProtocolError extends Error {
  code: number;
  constructor(err: { code: number, message: string}) {
    super(err.message);
    this.code = err.code;
  }
}
