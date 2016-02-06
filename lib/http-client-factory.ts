import { EventNotifier, eventPromise } from "./common";
import { get, ClientRequest, IncomingMessage } from "http";

export interface IHTTPClientFactory {
  create(host: string, port: number): IHTTPClient;
}

export interface IHTTPClient {
  get(path: string): Promise<string>;
}

export default class HTTPClientFactory implements IHTTPClientFactory {
  create(host: string, port: number): IHTTPClient {
    return new HTTPClient(host, port);
  }
}

class HTTPClient implements IHTTPClient {
  host: string;
  port: number;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
  }

  async get(path: string): Promise<string> {
    let request = get({host: this.host, port: this.port, path: path});
    let response = await getResponse(request);
    let statusCode = response.statusCode;
    let body = await readResponseBody(response);
    if (statusCode !== 200) {
      throw new ResponseError(body, statusCode);
    }
    return body;
  }
}

async function getResponse(request: ClientRequest): Promise<IncomingMessage> {
  return eventPromise<IncomingMessage>(request, "response", "error");
}

async function readResponseBody(response: IncomingMessage): Promise<string> {
  let body = "";
  response.setEncoding("utf8");
  response.on("data", chunk => {
    body += chunk;
  });
  await eventPromise(response, "end", "error");
  return body;
}

class ResponseError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}