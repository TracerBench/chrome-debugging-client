import * as http from "http";
import { eventPromise } from "./utils";

async function httpGet(host: string, port: number, path: string): Promise<http.IncomingMessage> {
  let req = http.get({
    host: host, port: port, path: path
  });
  return eventPromise<http.IncomingMessage>(req, "response", "error");
}

async function readBody(res: http.IncomingMessage): Promise<string> {
  let body = "";
  res.setEncoding("utf8");
  res.on("data", (chunk) => {
    body += chunk;
  });
  return eventPromise(res, "end", "error").then(() => body);
}

class HTTPClient {
  host: string;
  port: number;

  constructor(options?: HTTPClient.HTTPOptions) {
    this.host = options && options.host || "localhost";
    this.port = options && options.port || 9222;
  }

  async get(path: string): Promise<string> {
    let res = await httpGet(this.host, this.port, path);
    let body = await readBody(res);
    if (res.statusCode !== 200) {
      throw new HTTPClient.HTTPError(res.statusCode, body);
    }
    return body;
  }

  async list(): Promise<HTTPClient.Tab[]> {
    let body = await this.get("/json/list");
    return <HTTPClient.Tab[]>JSON.parse(body);
  }

  async new(url?: string): Promise<HTTPClient.Tab> {
    let path = "/json/new";
    if (url) {
      path += "?" + encodeURIComponent(url);
    }
    let body = await this.get(path);
    return <HTTPClient.Tab>JSON.parse(body);
  }

  async activate(tabId: string): Promise<string> {
    let path = "/json/activate/" + tabId;
    let body = await this.get(path);
    return body;
  }

  async close(tabId: string): Promise<string> {
    let path = "/json/close/" + tabId;
    let body = await this.get(path);
    return;
  }

  async version(): Promise<HTTPClient.Version> {
    let body = await this.get("/json/version");
    return <HTTPClient.Version>JSON.parse(body);
  }
}

namespace HTTPClient {
  export interface HTTPOptions {
  host?: string;
  port?: number;
}

  export interface Tab {
    description: string;
    devtoolsFrontendUrl: string;
    faviconUrl?: string;
    id: string;
    title: string;
    type: string;
    url: string;
    webSocketDebuggerUrl: string;
  }

  export interface Version {
    Browser: string,
    "Protocol-Version": string;
    "User-Agent": string;
    "WebKit-Version": string;
  }

  export class HTTPError extends Error {
    statusCode: number;
    constructor(statusCode: number, body: string) {
      super(body);
      this.statusCode = statusCode;
    }
  }
}

export default HTTPClient;