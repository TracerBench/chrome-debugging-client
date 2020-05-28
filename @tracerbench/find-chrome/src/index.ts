import { Launcher } from "chrome-launcher";
import * as fs from "fs";

const darwinWellKnown = [
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
] as const;

let cache: string | undefined;

export default function findChrome(): string {
  if (cache !== undefined) {
    return cache;
  }

  let path = checkEnv();
  if (!path) {
    if (process.platform === "darwin") {
      path = darwinQuickFind();
    } else {
      path = findInstallation();
    }
  }

  if (!path) {
    throw new Error(`Failed to find a Chrome installation`);
  }

  cache = path;

  return path;
}

function checkEnv(): string | undefined {
  const path = process.env.CHROME_PATH;
  if (path) {
    return path;
  }
}

function findInstallation(): string | undefined {
  const paths = Launcher.getInstallations();
  if (paths.length > 0) {
    return paths[0];
  }
}

function darwinQuickFind(): string | undefined {
  // lsregister is super slow, check some well know paths first
  for (const path of darwinWellKnown) {
    if (checkAccess(path)) {
      return path;
    }
  }
  return findInstallation();
}

function checkAccess(path: string): boolean {
  try {
    fs.accessSync(path, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}
