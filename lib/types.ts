/**
 * The session is a factory for the various debugging tools/clients that disposes them at the end.
 */
export interface ISession extends IDisposable {
  spawnBrowser(browserType: string, options?: IResolveOptions & ISpawnOptions): Promise<IBrowserProcess>;
  createAPIClient(host: string, port: number): IAPIClient;
  openDebuggingProtocol(webSocketDebuggerUrl: string): Promise<IDebuggingProtocolClient>;
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

export interface IDebuggingProtocolClient extends IEventNotifier, IWebSocketDelegate {
  send<T>(command: string, params?: any): Promise<T>;
  send(command: string, params?: any): Promise<any>;
}

export interface ITmpDir extends IDisposable {
  path: string;
}

export interface IEventNotifier {
  on(event: string, listener: (evt?: any) => void): any;
  removeListener(event: string, listener: (evt?: any) => void): any;
  removeAllListeners(event?: string): any;
}

export interface IVersionInfo {
  "Browser": string;
  "Protocol-Version": string;
  "User-Agent": string;
  "WebKit-Version": string;
}

export interface IHTTPClientFactory {
  create(host: string, port: number): IHTTPClient;
}

export interface IHTTPClient {
  get(path: string): Promise<string>;
}

export interface IWebSocketOpener {
  open(url: string, delegate: IWebSocketDelegate): Promise<IWebSocketConnection>;
}

export interface IWebSocketConnection extends IDisposable {
  send(data: string): void;
  close(): void;
}

export interface IWebSocketDelegate {
  socket: IWebSocketConnection;
  onMessage(data: string): void;
  onError(err: Error): void;
  onClose(): void;
}

export interface IDisposable {
  /* should not reject */
  dispose(): Promise<any>;
}

export interface IResolveOptions {
  executablePath?: string;
  chromiumSrcDir?: string;
}

export interface IExecutableInfo {
  executablePath: string;
  isContentShell: boolean;
}

export interface ISpawnOptions {
  windowSize?: {
    width: number;
    height: number;
  };
  additionalArguments?: string[];
}

export interface IBrowserProcess extends IDisposable {
  remoteDebuggingPort: number;
  dataDir: string;
  /** throws if process has exited or there has been an error */
  validate(): void;
}
