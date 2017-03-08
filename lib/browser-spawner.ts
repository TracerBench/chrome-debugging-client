import { EventNotifier, Disposable, delay } from "./common";
import { ChildProcess, spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

const PORT_FILENAME = "DevToolsActivePort";

export type SpawnOptions = {
  windowSize?: {
    width: number,
    height: number
  },
  additionalArguments?: string[];
}

export interface IBrowserSpawner {
  spawn(executablePath: string, dataDir: string, isContentShell: boolean, options?: SpawnOptions): Promise<IBrowserProcess>;
}

export interface IBrowserProcess extends Disposable {
  remoteDebuggingPort: number;
  dataDir: string;
  /** throws if process has exited or there has been an error */
  validate();
}

export default class BrowserSpawner implements IBrowserSpawner {
  async spawn(executablePath: string, dataDir: string, isContentShell: boolean, options?: SpawnOptions): Promise<IBrowserProcess> {
    let portFile = path.join(dataDir, PORT_FILENAME);
    // delete port file before launching
    await tryDeleteFile(portFile);
    let args = this.getArguments(dataDir, isContentShell, options);
    let process: IBrowserProcess = new BrowserProcess(executablePath, args);
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

  getArguments(dataDir: string, isContentShell: boolean, options?: SpawnOptions): string[] {
    let windowSize = options && options.windowSize || {
      width: 414,
      height: 736
    };
    let additionalArguments = options && options.additionalArguments || [];
    let args = [
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
      "--remote-debugging-port=0"
    ].concat(additionalArguments);
    if (isContentShell) {
      return args.concat([
        `--data-path=${dataDir}`,
        `--content-shell-host-window-size=${windowSize.width}x${windowSize.height}`,
        "about:blank"
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
      "--metrics-recording-only",
      "--no-default-browser-check",
      "--no-experiments",
      "--no-first-run",
      "--no-ping",
      "--no-proxy-server",
      `--user-data-dir=${dataDir}`,
      `--window-size=${windowSize.width},${windowSize.height}`,
      "about:blank"
    ]);
  }
}

class BrowserProcess implements IBrowserProcess {
  process: ChildProcess;
  pid: number;
  lastError: Error;
  hasExited: boolean = false;
  remoteDebuggingPort: number = 0;
  dataDir: string;

  constructor(executablePath, args) {
    let process = spawn(executablePath, args);
    process.on("error", err => this.lastError = err);
    process.on("exit", () => this.hasExited = true);
    this.process = process;
    this.pid = process.pid;
  }

  dispose(): Promise<void> {
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
    }).then(() => {
      this.process.removeAllListeners();
    }).catch((err) => console.error(err));
  }

  validate() {
    if (this.hasExited) {
      throw new Error("process exited");
    }
    if (this.lastError) {
      throw this.lastError;
    }
  }
}

function tryDeleteFile(filename: string): Promise<void> {
  return new Promise<void>(resolve => fs.unlink(filename, err => resolve()));
}

function tryReadPort(filename: string): Promise<number> {
  return new Promise<number>(resolve => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        resolve(0);
      }
      let port = parseInt(data, 10);
      // handles NaN if write was created but port not written
      port > 0 ? resolve(port) : resolve(0);
    });
  });
}
