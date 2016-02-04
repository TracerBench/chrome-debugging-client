import { EventNotifier } from "./common";
import { WebSocketDelegate } from "./web-socket-opener";
import { EventEmitter } from "events";

export interface DebuggingProtocolFactory {
  create();
}

export interface DebuggingProtocol extends EventNotifier, WebSocketDelegate {
  send(command: string, params?: any): Promise<any>;
  domains(protocol: Protocol): any;
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

  domains(protocol?: Protocol): any {
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
    }).then((res: Response) => {
      if (res.error) {
        throw new ProtocolError(res.error);
      }
      return res.result;
    });
  }
}

class Domain {
  private _client: DebuggingProtocol;
  private _domain: Protocol.Domain;

  constructor(client: DebuggingProtocol, domain: Protocol.Domain) {
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

export namespace Protocol {
  export interface Version {
    major: string;
    minor: string;
  }

  export interface Domain {
    domain: string;
    description?: string;
    hidden?: boolean;
    commands?: Command[];
    events?: Event[];
    types?: Type[];
  }

  export interface Command {
    name: string;
    description?: string;
    hidden?: boolean;
    parameters?: NamedDescriptor[];
    returns?: NamedDescriptor[];
  }

  export interface Event {
    name: string;
    description?: string;
    hidden?: boolean;
    deprecated?: boolean;
    parameters?: NamedDescriptor[];
  }

  export interface Type extends Descriptor {
    id: string;
  }

  export interface NamedDescriptor extends Descriptor {
    name: string;
    optional?: boolean;
  }

  export interface Descriptor {
    description?: string;
    hidden?: boolean;
    $ref?: string;
    type?: string;
    enum?: string[];
    items?: Descriptor;
    properties?: NamedDescriptor[];
  }
}

export interface Protocol {
  domains: Protocol.Domain[];
  version: Protocol.Version;
}
