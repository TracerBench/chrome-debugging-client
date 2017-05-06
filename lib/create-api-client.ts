import { IAPIClient, IHTTPClient, ITab, IVersionInfo } from "./types";

export default function createAPIClient(httpClient: IHTTPClient): IAPIClient {
  return new APIClient(httpClient);
}

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
