import { ChildProcess, spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { delay } from "./delay";
import { IBrowserProcess, ISpawnOptions } from "./types";

const PORT_FILENAME = "DevToolsActivePort";

export default async function spawnBrowser(executablePath: string, dataDir: string,
                                           isContentShell: boolean, options?: ISpawnOptions): Promise<IBrowserProcess> {
  const portFile = path.join(dataDir, PORT_FILENAME);
  // delete port file before launching
  await tryDeleteFile(portFile);
  const args = getArguments(dataDir, isContentShell, options);
  const process: IBrowserProcess = new BrowserProcess(executablePath, args);
  try {
    let port: number = 0;
    let tries = 0;
    while (true) {
      if (++tries > 10) {
        throw new Error("failed waiting for port file");
      }
      await delay(200);
      port = await tryReadPort(portFile);
      process.validate();
      if (port > 0) {
        process.remoteDebuggingPort = port;
        process.dataDir = dataDir;
        break;
      }
    }
    return process;
  } catch (err) {
    await process.dispose();
    throw err;
  }
}

function getArguments(dataDir: string, isContentShell: boolean, options?: ISpawnOptions): string[] {
  const windowSize = options && options.windowSize || {
    height: 736,
    width: 414,
  };
  const additionalArguments = options && options.additionalArguments || [];
  const args = [
    // base switches
    "--disable-breakpad",
    "--noerrdialogs",
    // content switches
    "--allow-insecure-localhost",
    "--disable-hang-monitor",
    "--disable-notifications",
    "--disable-web-security",
    "--disable-v8-idle-tasks",
    "--disable-xss-auditor",
    "--ignore-certificate-errors",
    "--no-sandbox",
    "--reduce-security-for-testing",
    "--safebrowsing-disable-auto-update",
    "--v8-cache-options=none",
    "--process-per-tab",
    "--use-mock-keychain",
    "--password-store=basic",
    //  first available ephemeral port
    "--remote-debugging-port=0",
  ].concat(additionalArguments);
  if (isContentShell) {
    return args.concat([
      `--data-path=${dataDir}`,
      `--content-shell-host-window-size=${windowSize.width}x${windowSize.height}`,
      "about:blank",
    ]);
  }
  return args.concat([
    "--disable-add-to-shelf",
    "--disable-background-networking",
    "--disable-client-side-phishing-detection",
    "--disable-component-extensions-with-background-pages",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=NetworkPrediction",
    "--disable-popup-blocking",
    "--disable-prompt-on-repost",
    "--disable-sync",
    "--disable-translate", // auto translate
    "--metrics-recording-only",
    "--no-default-browser-check",
    "--no-experiments",
    "--no-first-run",
    "--no-ping",
    "--no-proxy-server",
    `--user-data-dir=${dataDir}`,
    `--window-size=${windowSize.width},${windowSize.height}`,
    "about:blank",
  ]);
}

/* tslint:disable:max-classes-per-file */
class BrowserProcess implements IBrowserProcess {
  public remoteDebuggingPort: number = 0;
  public dataDir: string;
  public pid: number;

  private process: ChildProcess;
  private lastError: Error;
  private hasExited: boolean = false;

  constructor(executablePath: string, args: string[]) {
    const process = spawn(executablePath, args);
    process.on("error", (err) => this.lastError = err);
    process.on("exit", () => this.hasExited = true);
    this.process = process;
    this.pid = process.pid;
  }

  public dispose(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (this.hasExited) {
        resolve();
      } else {
        this.process.on("exit", resolve);
        this.process.kill();
        // race
        setTimeout(resolve, 2000);
        setTimeout(() => this.process.kill("SIGKILL"), 2000);
      }
    }).then(() => {
      this.process.removeAllListeners();
    }).catch((err) => {
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
  return new Promise<void>((resolve) => fs.unlink(filename, () => resolve()));
}

function tryReadPort(filename: string): Promise<number> {
  return new Promise<number>((resolve) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        resolve(0);
      }
      const port = parseInt(data, 10);
      // handles NaN if write was created but port not written
      port > 0 ? resolve(port) : resolve(0);
    });
  });
}
