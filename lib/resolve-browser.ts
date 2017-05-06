import * as os from "os";
import { IExecutableInfo, IResolveOptions } from "./types";

const APP_NAMES = {
  darwin: {
    chromium: "Chromium.app/Contents/MacOS/Chromium",
    content_shell: "Content Shell.app/Contents/MacOS/Content Shell",
  },
  linux: {
    chromium: "chrome",
    content_shell: "content_shell",
  },
  win32: {
    chromium: "chrome.exe",
    content_shell: "content_shell.exe",
  },
};

const platform = (() => {
  switch (os.platform()) {
    case "darwin": return "darwin";
    case "win32": return "win32";
    case "linux":
    default: return "linux";
  }
})();

const chromiumAppName = APP_NAMES[platform].chromium;
const contentShellAppName = APP_NAMES[platform].content_shell;

export default function resolveBrowser(browserType: string, options?: IResolveOptions): IExecutableInfo {
  if (!options) {
    options = {};
  }
  let executablePath: string | undefined;
  switch (browserType) {
    case "exact":
      executablePath = options.executablePath;
      break;
    case "system":
    case "canary":
      executablePath = resolveChromeApplication(browserType);
      break;
    case "release":
    case "content-shell-release":
    case "debug":
    case "content-shell-debug":
      executablePath = resolveChromiumBuild(browserType, options);
      break;
  }
  if (!executablePath) {
  throw new Error(`failed to resolve browser for type ${browserType}`);
  }
  return {
    executablePath,
    isContentShell: executablePath.endsWith(contentShellAppName),
  };
}

function resolveChromiumBuild(browserType: string, options: IResolveOptions): string | undefined {
  const chromiumSrcDir = options.chromiumSrcDir || `${os.homedir()}/chromium/src`;
  switch (browserType) {
    case "release":
      return `${chromiumSrcDir}/out/Release/${chromiumAppName}`;
    case "debug":
      return `${chromiumSrcDir}/out/Debug/${chromiumAppName}`;
    case "content-shell-release":
      return `${chromiumSrcDir}/out/Release/${contentShellAppName}`;
    case "content-shell-debug":
      return `${chromiumSrcDir}/out/Debug/${contentShellAppName}`;
    default:
      return;
  }
}

function resolveChromeApplication(browserType: string): string | undefined {
  if (platform !== "darwin") {
    // TODO other platforms, can use exact or build variants
    return;
  }
  if (browserType === "canary") {
    return "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary";
  }
  return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
}
