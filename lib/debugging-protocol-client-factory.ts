import { EventEmitter } from "events";
import { IEventNotifier } from "./common";
import { IWebSocketConnection, IWebSocketDelegate } from "./web-socket-opener";

export interface IDebuggingProtocolClientFactory {
  create(): IDebuggingProtocolClient;
}

export interface IDebuggingProtocolClient extends IEventNotifier, IWebSocketDelegate {
  send<T>(command: string, params?: any): Promise<T>;
  send(command: string, params?: any): Promise<any>;
}

interface ICommandRequest {
  id: number;
  method: string;
  params: string;
  resolve: (res: ICommandResponseMessage) => void;
  reject: (reason: any) => void;
}

interface IEventMessage {
  method: string;
  params: any;
}

interface ISuccessResponseMessage {
  id: number;
  result: any;
}

interface IErrorResponseMessage {
  id: number;
  error: {
    code: number;
    message: string;
  };
}

interface IMessage extends IEventMessage, ISuccessResponseMessage, IErrorResponseMessage {}

interface ICommandResponseMessage extends ISuccessResponseMessage, IErrorResponseMessage {}

export default class DebuggingProtocolFactory implements IDebuggingProtocolClientFactory {
  public create(): IDebuggingProtocolClient {
    return new DebuggingProtocol();
  }
}

/* tslint:disable:max-classes-per-file */
class DebuggingProtocol extends EventEmitter implements IDebuggingProtocolClient {
  public socket: IWebSocketConnection;
  private seq = 0;
  private pendingRequests = new Map<number, ICommandRequest>();

  constructor() {
    super();
  }

  public send(method: string, params?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = this.seq++;
      this.socket.send(JSON.stringify({id, method, params}));
      this.pendingRequests.set(id, { id, method, params, resolve, reject });
    }).then((res: ICommandResponseMessage) => {
      if (res.error) {
        throw new ProtocolError(res.error);
      }
      return res.result;
    });
  }

  public onMessage(data: string) {
    try {
      const msg: IMessage = JSON.parse(data);
      if (msg.id !== undefined) {
        const req = this.pendingRequests.get(msg.id);
        this.pendingRequests.delete(msg.id);
        if (req) {
          req.resolve(msg);
        }
      } else {
        this.emit(msg.method, msg.params);
      }
    } catch (err) {
      this.onError(err);
      this.socket.close();
    }
  }

  public onClose() {
    this.clearPending(new Error("socket disconnect"));
    this.emit("close");
  }

  public onError(err: Error) {
    this.clearPending(err);
    this.socket.close();
    this.emit("error", err);
  }

  private clearPending(err: Error) {
    if (this.pendingRequests.size) {
      this.pendingRequests.forEach((req) => {
        req.reject(err);
      });
      this.pendingRequests.clear();
    }
  }
}

class ProtocolError extends Error {
  public code: number;
  constructor(err: {
    code: number;
    message: string;
  }) {
    super(err.message);
    this.code = err.code;
  }
}
