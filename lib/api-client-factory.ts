import { IHTTPClient } from "./http-client-factory";

export interface IAPIClientFactory {
  create(httpClient: IHTTPClient): IAPIClient;
}

export interface IAPIClient {
  version(): Promise<IVersionInfo>;
  listTabs(): Promise<ITab[]>;
  newTab(url?: string): Promise<ITab>;
  activateTab(tabId: string): Promise<void>;
  closeTab(tabId: string): Promise<void>;
}

export interface ITab {
  id: string;
  webSocketDebuggerUrl?: string;
  description?: string;
  devtoolsFrontendUrl?: string;
  faviconUrl?: string;
  title?: string;
  type?: string;
  url?: string;
}

export interface IVersionInfo {
  "Browser": string;
  "Protocol-Version": string;
  "User-Agent": string;
  "WebKit-Version": string;
}

export default class APIClientFactory implements IAPIClientFactory {
  public create(httpClient: IHTTPClient): IAPIClient {
    return new APIClient(httpClient);
  }
}

/* tslint:disable:max-classes-per-file */

class APIClient implements IAPIClient {
  private httpClient: IHTTPClient;

  constructor(httpClient: IHTTPClient) {
    this.httpClient = httpClient;
  }

  public async version(): Promise<IVersionInfo> {
    const body = await this.httpClient.get("/json/version");
    return JSON.parse(body) as IVersionInfo;
  }

  public async listTabs(): Promise<ITab[]> {
    const body = await this.httpClient.get("/json/list");
    return JSON.parse(body) as ITab[];
  }

  public async newTab(url?: string): Promise<ITab> {
    let path = "/json/new";
    if (url) {
      path += "?" + encodeURIComponent(url);
    }
    const body = await this.httpClient.get(path);
    return JSON.parse(body) as ITab;
  }

  public async activateTab(tabId: string): Promise<void> {
    const path = "/json/activate/" + tabId;
    await this.httpClient.get(path);
    return;
  }

  public async closeTab(tabId: string): Promise<void> {
    const path = "/json/close/" + tabId;
    await this.httpClient.get(path);
    return;
  }
}
