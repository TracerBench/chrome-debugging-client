import createAPIClient from "./create-api-client";
import createDebuggingProtocolClient from "./create-debugging-protocol-client";
import createHTTPClient from "./create-http-client";
import createTmpDir from "./create-tmpdir";
import Disposables from "./disposables";
import openWebSocket from "./open-web-socket";
import resolveBrowser from "./resolve-browser";
import spawnBrowser from "./spawn-browser";
import {
  IAPIClient,
  IBrowserProcess,
  IDebuggingProtocolClient,
  IDisposable,
  IResolveOptions,
  ISession,
  ISpawnOptions,
} from "./types";

export async function createSession<T>(
  cb: (session: ISession) => PromiseLike<T> | T,
): Promise<T> {
  const session = new Session();
  try {
    return await cb(session);
  } finally {
    await session.dispose();
  }
}

export async function createSessions<T>(
  count: number,
  cb: (sessions: ISession[]) => PromiseLike<T> | T,
): Promise<T> {
  const disposables = new Disposables();
  const sessions: ISession[] = [];
  try {
    while (count--) {
      const session = new Session();
      disposables.add(session);
      sessions.push(session);
    }
    return await cb(sessions);
  } finally {
    await disposables.dispose();
  }
}

class Session implements IDisposable {
  private disposables = new Disposables();

  public async spawnBrowser(
    options?: IResolveOptions & ISpawnOptions,
  ): Promise<IBrowserProcess> {
    const executablePath = resolveBrowser(options);
    const tmpDir = await createTmpDir();
    this.disposables.add(tmpDir);
    const browserProcess = await spawnBrowser(
      executablePath,
      tmpDir.path,
      options,
    );
    this.disposables.add(browserProcess);
    return browserProcess;
  }

  public createAPIClient(host: string, port: number): IAPIClient {
    return createAPIClient(createHTTPClient(host, port));
  }

  public async openDebuggingProtocol(
    webSocketDebuggerUrl: string,
  ): Promise<IDebuggingProtocolClient> {
    const debuggingProtocol = createDebuggingProtocolClient();
    const connection = await openWebSocket(
      webSocketDebuggerUrl,
      debuggingProtocol,
    );
    this.disposables.add(connection);
    return debuggingProtocol;
  }

  public dispose() {
    return this.disposables.dispose();
  }
}
