import {
  default as BrowserResolver,
  IBrowserResolver,
  ResolveOptions
} from "./browser-resolver";
import {
  default as BrowserSpawner,
  IBrowserSpawner,
  IBrowserProcess
} from "./browser-spawner";
import {
  default as TmpDirCreator,
  ITmpDirCreator
} from "./tmpdir-creator";
import {
  default as HTTPClientFactory,
  IHTTPClientFactory,
  IHTTPClient
} from "./http-client-factory";
import {
  default as APIClientFactory,
  IAPIClientFactory,
  IAPIClient
} from "./api-client-factory";
import {
  default as WebSocketOpener,
  IWebSocketOpener
} from "./web-socket-opener";
import {
  default as DebuggingProtocolClientFactory,
  IDebuggingProtocolClientFactory,
  IDebuggingProtocolClient
} from "./debugging-protocol-factory";
import { Disposable } from "./common";

/**
 * The session is a factory for the various debugging tools/clients that disposes them at the end.
 */
export interface ISession extends Disposable {
  spawnBrowser(browserType: string, options?: ResolveOptions): Promise<IBrowserProcess>;
  createAPIClient(host, port): IAPIClient;
  openDebuggingProtocol(webSocketDebuggerUrl: string): Promise<IDebuggingProtocolClient>;
}

export default async function createSession<T>(cb: (session: ISession) => T | PromiseLike<T>): Promise<T> {
  let session = new Session(
    new BrowserResolver(),
    new TmpDirCreator(),
    new BrowserSpawner(),
    new HTTPClientFactory(),
    new APIClientFactory(),
    new WebSocketOpener(),
    new DebuggingProtocolClientFactory()
  );
  try {
    return await cb(session);
  } finally {
    await session.dispose();
  }
}

class Session {
  disposables: Disposable[] = [];

  browserResolver: IBrowserResolver;
  tmpDirCreator: ITmpDirCreator;
  browserSpawner: IBrowserSpawner;
  httpClientFactory: IHTTPClientFactory;
  apiClientFactory: IAPIClientFactory;
  webSocketOpener: IWebSocketOpener;
  debuggingProtocolFactory: IDebuggingProtocolClientFactory;

  constructor(
    browserResolver: IBrowserResolver,
    tmpDirCreator: ITmpDirCreator,
    browserSpawner: IBrowserSpawner,
    httpClientFactory: IHTTPClientFactory,
    apiClientFactory: IAPIClientFactory,
    webSocketOpener: IWebSocketOpener,
    debuggingProtocolFactory: IDebuggingProtocolClientFactory
  ) {
    this.browserResolver = browserResolver;
    this.tmpDirCreator = tmpDirCreator;
    this.browserSpawner = browserSpawner;
    this.httpClientFactory = httpClientFactory;
    this.apiClientFactory = apiClientFactory;
    this.webSocketOpener = webSocketOpener;
    this.debuggingProtocolFactory = debuggingProtocolFactory;
  }

  async spawnBrowser(browserType: string, options?: ResolveOptions): Promise<IBrowserProcess> {
    let browser = this.browserResolver.resolve(browserType, options);
    let tmpDir = await this.tmpDirCreator.create();
    this.disposables.push(tmpDir);
    let process = await this.browserSpawner.spawn(browser.executablePath, tmpDir.path, browser.isContentShell);
    this.disposables.push(process);
    return process;
  }

  createAPIClient(host: string, port: number): IAPIClient {
    return this.apiClientFactory.create(this.httpClientFactory.create(host, port));
  }

  async openDebuggingProtocol(webSocketDebuggerUrl: string): Promise<IDebuggingProtocolClient> {
    let debuggingProtocol = this.debuggingProtocolFactory.create();
    let connection = await this.webSocketOpener.open(webSocketDebuggerUrl, debuggingProtocol);
    this.disposables.push(connection);
    return debuggingProtocol;
  }

  dispose() {
    return Promise.all(this.disposables.map(disposable => disposable.dispose()));
  }
}
