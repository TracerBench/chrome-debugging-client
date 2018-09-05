import { ChildProcess } from "child_process";
import * as execa from "execa";
import * as fs from "fs";
import * as path from "path";
import { delay } from "./delay";
import { DEFAULT_FLAGS } from "./flags";
import { IBrowserProcess, ISpawnOptions } from "./types";

const PORT_FILENAME = "DevToolsActivePort";
const NEWLINE = /\r?\n/;

// roughly the same as the chromedriver chrome_launcher
// https://chromium.googlesource.com/chromium/src/+/6fd4390daea50497e5ead4583829e2e8f9b215b2/chrome/test/chromedriver/chrome_launcher.cc#445
// Launch chrome, wait for the DevToolsActivePort port file 60 second timeout polling on a 50ms interval.
export default async function spawnBrowser(
  executablePath: string,
  dataDir: string,
  options?: ISpawnOptions,
): Promise<IBrowserProcess> {
  const portFile = path.join(dataDir, PORT_FILENAME);
  // delete port file before launching
  await tryDeleteFile(portFile);
  const args = getArguments(dataDir, options);
  const process: IBrowserProcess = new BrowserProcess(
    executablePath,
    args,
    options === undefined ? undefined : options.stdio,
  );
  const deadline = Date.now() + 60 * 1000;
  try {
    let port: number = 0;
    let wsPath: string | undefined;
    while (true) {
      await delay(50);
      [port, wsPath] = await tryReadPort(portFile);
      process.validate();
      if (port > 0) {
        process.remoteDebuggingPort = port;
        process.remoteDebuggingPath = wsPath;
        process.dataDir = dataDir;
        break;
      }
      if (Date.now() > deadline) {
        throw new Error(`timeout waiting for ${portFile}`);
      }
    }
    return process;
  } catch (err) {
    await process.dispose();
    throw err;
  }
}

function getArguments(dataDir: string, options?: ISpawnOptions): string[] {
  const windowSize = (options && options.windowSize) || {
    height: 736,
    width: 414,
  };
  const defaultArguments =
    options === undefined || options.disableDefaultArguments !== true
      ? DEFAULT_FLAGS
      : [];
  const additionalArguments = (options && options.additionalArguments) || [];
  return [
    "--remote-debugging-port=0",
    `--user-data-dir=${dataDir}`,
    `--window-size=${windowSize.width},${windowSize.height}`,
  ].concat(defaultArguments, additionalArguments, ["about:blank"]);
}

/* tslint:disable:max-classes-per-file */
class BrowserProcess implements IBrowserProcess {
  public remoteDebuggingPort: number = 0;
  public remoteDebuggingPath: string | undefined;
  public dataDir: string;
  public pid: number;

  private process: ChildProcess;
  private lastError: Error;
  private hasExited: boolean = false;

  constructor(
    executablePath: string,
    args: string[],
    stdio: "pipe" | "ignore" | "inherit" | null = "inherit",
  ) {
    // the types aren't current for this
    // disabling buffer used to be maxBuffer: null
    // now it is buffer: false
    const child = execa(executablePath, args, {
      // disable buffer, pipe or drain
      buffer: false,
      stdio,
    } as any);
    // child is now a thenable for the duration of the promise
    // ensure we handle its error or we will get an
    // unhandled rejection warning
    child.catch(err => (this.lastError = err));
    child.on("exit", () => (this.hasExited = true));
    this.process = child;
    this.pid = child.pid;
  }

  public get webSocketDebuggerUrl() {
    return `ws://127.0.0.1:${this.remoteDebuggingPort}${
      this.remoteDebuggingPath
    }`;
  }

  public dispose(): Promise<void> {
    return new Promise<void>(resolve => {
      if (this.hasExited) {
        resolve();
      } else {
        this.process.on("exit", resolve);
        this.process.kill();
        // race
        setTimeout(resolve, 2000);
        setTimeout(() => this.process.kill("SIGKILL"), 2000);
      }
    })
      .then(() => {
        this.process.removeAllListeners();
      })
      .catch(err => {
        /* tslint:disable:no-console */
        console.error(err);
        /* tslint:enable:no-console */
      });
  }

  public validate() {
    if (this.hasExited) {
      throw new Error("process exited");
    }
    if (this.lastError) {
      throw this.lastError;
    }
  }
}

function tryDeleteFile(filename: string): Promise<void> {
  return new Promise<void>(resolve => fs.unlink(filename, () => resolve()));
}

function tryReadPort(filename: string) {
  return new Promise<[number, string | undefined]>(resolve => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err || data.length === 0) {
        resolve([0, undefined]);
      } else {
        const [portStr, wsPath] = data.split(NEWLINE, 2);
        const port = parseInt(portStr, 10);
        // handles NaN if write was created but port not written
        port > 0 ? resolve([port, wsPath]) : resolve([0, wsPath]);
      }
    });
  });
}
