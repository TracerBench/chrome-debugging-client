import { EventNotifier } from "./common";
import { WebSocketDelegate } from "./web-socket-opener";
import { EventEmitter } from "events";
import * as Protocol from "./protocol";

export interface DebuggingProtocolClientFactory {
  create();
}

export interface DebuggingProtocolClient extends EventNotifier, WebSocketDelegate {
  send(command: string, params?: any): Promise<any>;
  domains(protocol: Protocol.Protocol): any;
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

export default class DebuggingProtocolFactoryImpl implements DebuggingProtocolClientFactory {
  create(): DebuggingProtocolClient {
    return new DebuggingProtocolImpl();
  }
}

class DebuggingProtocolImpl extends EventEmitter implements DebuggingProtocolClient {
  seq = 0;
  pendingRequests = new Map<number, CommandRequest>();
  socket: {
    send(data: string);
    close();
  };

  constructor() {
    super();
  }

  domains(protocol?: Protocol.Protocol): any {
    let all = {};
    protocol.domains.forEach(domain => {
      all[domain.domain] = new Domain(this, domain);
    });
    return all;
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

class Domain {
  private _client: DebuggingProtocolClient;
  private _domain: Protocol.Domain;

  constructor(client: DebuggingProtocolClient, domain: Protocol.Domain) {
    this._client = client;
    this._domain = domain;
    if (domain.commands) {
      domain.commands.forEach(command => {
        let prefixed = `${domain.domain}.${command.name}`;
        this[command.name] = (params) => {
          return this._client.send(prefixed, params);
        };
      });
    }
    if (domain.events) {
      domain.events.forEach(event => {
        let prefixed = `${domain.domain}.${event.name}`;
        let listener;
        Object.defineProperty(this, event.name, {
          get: () => {
            return listener;
          },
          set: (v) => {
            if (listener) {
              this._client.removeListener(prefixed, listener);
            }
            listener = v;
            if (v) {
              this._client.on(prefixed, v);
            }
          }
        });
      });
    }
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
