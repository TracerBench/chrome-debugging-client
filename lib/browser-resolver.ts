import * as os from "os";

export interface IBrowserResolver {
  resolve(browserType: string, options?: ResolveOptions): ExecutableInfo;
}

export type ResolveOptions = {
  executablePath?: string;
  chromiumSrcDir?: string;
}

export interface ExecutableInfo {
  executablePath: string;
  isContentShell: boolean;
}

const APP_NAMES = {
  darwin: {
    chromium: "Chromium.app/Contents/MacOS/Chromium",
    content_shell: "Content Shell.app/Contents/MacOS/Content Shell"
  },
  win32: {
    chromium: "chrome.exe",
    content_shell: "content_shell.exe"
  },
  linux: {
    chromium: "chrome",
    content_shell: "content_shell"
  }
};

export default class BrowserResolver implements IBrowserResolver {
  get platform() {
    switch (os.platform()) {
      case "darwin": return "darwin";
      case "win32": return "win32";
      case "linux":
      default: return "linux";
    }
  }

  get chromiumAppName(): string {
    return APP_NAMES[this.platform]["chromium"];
  }

  get contentShellAppName(): string {
    return APP_NAMES[this.platform]["content_shell"];
  }

  resolve(browserType: string, options?: ResolveOptions): ExecutableInfo {
    if (!options) {
      options = {};
    }
    let executablePath: string;
    switch (browserType) {
      case "exact":
        executablePath = options.executablePath;
        break;
      case "system":
      case "canary":
        executablePath = this.resolveChromeApplication(browserType);
        break;
      case "release":
      case "content-shell-release":
      case "debug":
      case "content-shell-debug":
        executablePath = this.resolveChromiumBuild(browserType, options);
        break;
    }
    if (!executablePath) {
      throw new Error(`failed to resolve browser for type ${browserType}`);
    }
    return {
      executablePath: executablePath,
      isContentShell: executablePath.endsWith(this.contentShellAppName)
    };
  }

  resolveChromiumBuild(browserType: string, options: ResolveOptions): string {
    let chromiumSrcDir = options.chromiumSrcDir || `${os.homedir()}/chromium/src`;
    switch (browserType) {
      case "release":
        return `${chromiumSrcDir}/out/Release/${this.chromiumAppName}`;
      case "debug":
        return `${chromiumSrcDir}/out/Debug/${this.chromiumAppName}`;
      case "content-shell-release":
        return `${chromiumSrcDir}/out/Release/${this.contentShellAppName}`;
      case "content-shell-debug":
        return `${chromiumSrcDir}/out/Debug/${this.contentShellAppName}`;
    }
  }

  resolveChromeApplication(browserType: string): string {
    if (this.platform !== "darwin") {
      // TODO other platforms, can use exact or build variants
      return;
    }
    if (browserType === "canary") {
      return "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary";
    }
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
}