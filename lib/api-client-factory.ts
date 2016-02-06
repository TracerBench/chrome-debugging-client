import { IHTTPClient } from "./http-client-factory";

export interface IAPIClientFactory {
  create(httpClient: IHTTPClient): IAPIClient;
}

export interface IAPIClient {
  version(): Promise<VersionInfo>;
  listTabs(): Promise<Tab[]>;
  newTab(url?: string): Promise<Tab>;
  activateTab(tabId: string): Promise<void>;
  closeTab(tabId: string): Promise<void>;
}

export interface Tab {
  id: string;
  webSocketDebuggerUrl?: string;
  description?: string;
  devtoolsFrontendUrl?: string;
  faviconUrl?: string;
  title?: string;
  type?: string;
  url?: string;
}

export interface VersionInfo {
  "Browser": string;
  "Protocol-Version": string;
  "User-Agent": string;
  "WebKit-Version": string;
}

export default class APIClientFactory implements IAPIClientFactory {
  create(httpClient: IHTTPClient): IAPIClient {
    return new APIClient(httpClient);
  }
}

class APIClient implements IAPIClient {
  httpClient: IHTTPClient;

  constructor(httpClient: IHTTPClient) {
    this.httpClient = httpClient;
  }

  async version(): Promise<VersionInfo> {
    let body = await this.httpClient.get("/json/version");
    return <VersionInfo>JSON.parse(body);
  }

  async listTabs(): Promise<Tab[]> {
    let body = await this.httpClient.get("/json/list");
    return <Tab[]>JSON.parse(body);
  }

  async newTab(url?: string): Promise<Tab> {
    let path = "/json/new";
    if (url) {
      path += "?" + encodeURIComponent(url);
    }
    let body = await this.httpClient.get(path);
    return <Tab>JSON.parse(body);
  }

  async activateTab(tabId: string): Promise<void> {
    let path = "/json/activate/" + tabId;
    let body = await this.httpClient.get(path);
    return;
  }

  async closeTab(tabId: string): Promise<void> {
    let path = "/json/close/" + tabId;
    let body = await this.httpClient.get(path);
    return;
  }
}