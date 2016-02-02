import { EventNotifier, Disposable, delay } from "./common";
import { ChildProcess, spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";

const PORT_FILENAME = "DevToolsActivePort";

export interface BrowserSpawner {
  spawn(executablePath: string, dataDir: string, isContentShell: boolean): Promise<BrowserProcess>;
}

export interface BrowserProcess extends Disposable {
  remoteDebuggingPort: number;
  // throws if process has exited or there was an error
  validate();
}

export default class BrowserSpawnerImpl implements BrowserSpawner {
  async spawn(executablePath: string, dataDir: string, isContentShell: boolean): Promise<BrowserProcess> {
    let portFile = path.join(dataDir, PORT_FILENAME);
    // delete port file before launching
    await tryDeleteFile(portFile);
    let args = this.getArguments(dataDir, isContentShell);
    let process: BrowserProcess = new BrowserProcessImpl(executablePath, args);
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
          break;
        }
      }
      return process;
    } catch (err) {
      await process.dispose();
      throw err;
    }
  }

  getArguments(dataDir: string, isContentShell: boolean): string[] {
    let args = [
      "--enable-net-benchmarking",
      "--metrics-recording-only",
      "--no-default-browser-check",
      "--no-first-run",
      "--enable-gpu-benchmarking",
      "--disable-background-networking",
      "--no-proxy-server",
      "--disable-component-extensions-with-background-pages",
      "--disable-default-apps",
      //  first available ephemeral port
      "--remote-debugging-port=0"
    ];
    if (isContentShell) {
      return args.concat([
        "--data-path=" + dataDir,
        "--no-sandbox",
        "--no-experiments",
        "--content-shell-host-window-size=414x736",
        "about:blank"
      ]);
    }
    return args.concat([
      "--user-data-dir=" + dataDir,
      "--no-sandbox",
      "--no-experiments",
      "--disable-extensions",
      "--noerrdialogs",
      "--window-size=414,736",
      "about:blank"
    ]);
  }
}

class BrowserProcessImpl implements BrowserProcess {
  process: ChildProcess;
  pid: number;
  lastError: Error;
  hasExited: boolean = false;
  remoteDebuggingPort: number = 0;

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
