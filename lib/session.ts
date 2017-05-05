import {
  default as APIClientFactory,
  IAPIClient,
  IAPIClientFactory,
} from "./api-client-factory";
import {
  default as BrowserResolver,
  IBrowserResolver,
  IResolveOptions,
} from "./browser-resolver";
import {
  default as BrowserSpawner,
  IBrowserProcess,
  IBrowserSpawner,
  ISpawnOptions,
} from "./browser-spawner";
import { IDisposable } from "./common";
import {
  default as DebuggingProtocolClientFactory,
  IDebuggingProtocolClient,
  IDebuggingProtocolClientFactory,
} from "./debugging-protocol-client-factory";
import {
  default as HTTPClientFactory,
  IHTTPClientFactory,
} from "./http-client-factory";
import {
  default as TmpDirCreator,
  ITmpDirCreator,
} from "./tmpdir-creator";
import {
  default as WebSocketOpener,
  IWebSocketOpener,
} from "./web-socket-opener";

/**
 * The session is a factory for the various debugging tools/clients that disposes them at the end.
 */
export interface ISession extends IDisposable {
  spawnBrowser(browserType: string, options?: IResolveOptions & ISpawnOptions): Promise<IBrowserProcess>;
  createAPIClient(host: string, port: number): IAPIClient;
  openDebuggingProtocol(webSocketDebuggerUrl: string): Promise<IDebuggingProtocolClient>;
}

export default async function createSession<T>(cb: (session: ISession) => T | PromiseLike<T>): Promise<T> {
  const session = new Session(
    new BrowserResolver(),
    new TmpDirCreator(),
    new BrowserSpawner(),
    new HTTPClientFactory(),
    new APIClientFactory(),
    new WebSocketOpener(),
    new DebuggingProtocolClientFactory(),
  );
  try {
    return await cb(session);
  } finally {
    await session.dispose();
  }
}

class Session {
  private disposables: IDisposable[] = [];

  private browserResolver: IBrowserResolver;
  private tmpDirCreator: ITmpDirCreator;
  private browserSpawner: IBrowserSpawner;
  private httpClientFactory: IHTTPClientFactory;
  private apiClientFactory: IAPIClientFactory;
  private webSocketOpener: IWebSocketOpener;
  private debuggingProtocolFactory: IDebuggingProtocolClientFactory;

  constructor(
    browserResolver: IBrowserResolver,
    tmpDirCreator: ITmpDirCreator,
    browserSpawner: IBrowserSpawner,
    httpClientFactory: IHTTPClientFactory,
    apiClientFactory: IAPIClientFactory,
    webSocketOpener: IWebSocketOpener,
    debuggingProtocolFactory: IDebuggingProtocolClientFactory,
  ) {
    this.browserResolver = browserResolver;
    this.tmpDirCreator = tmpDirCreator;
    this.browserSpawner = browserSpawner;
    this.httpClientFactory = httpClientFactory;
    this.apiClientFactory = apiClientFactory;
    this.webSocketOpener = webSocketOpener;
    this.debuggingProtocolFactory = debuggingProtocolFactory;
  }

  public async spawnBrowser(browserType: string, options?: IResolveOptions & ISpawnOptions): Promise<IBrowserProcess> {
    const browser = this.browserResolver.resolve(browserType, options);
    const tmpDir = await this.tmpDirCreator.create();
    this.disposables.push(tmpDir);
    const process = await this.browserSpawner.spawn(
      browser.executablePath, tmpDir.path, browser.isContentShell, options);
    this.disposables.push(process);
    return process;
  }

  public createAPIClient(host: string, port: number): IAPIClient {
    return this.apiClientFactory.create(this.httpClientFactory.create(host, port));
  }

  public async openDebuggingProtocol(webSocketDebuggerUrl: string): Promise<IDebuggingProtocolClient> {
    const debuggingProtocol = this.debuggingProtocolFactory.create();
    const connection = await this.webSocketOpener.open(webSocketDebuggerUrl, debuggingProtocol);
    this.disposables.push(connection);
    return debuggingProtocol;
  }

  public async dispose() {
    const { disposables } = this;
    for (let i = disposables.length - 1; i >= 0; i--) {
      try {
        await disposables[i].dispose();
      } catch (e) {
        /* tslint:disable:no-console */
        console.error(e);
        /* tslint:enable:no-console */
      }
    }
  }
}
