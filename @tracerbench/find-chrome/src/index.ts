import * as chromeFinder from "chrome-launcher/dist/chrome-finder";
import { getPlatform } from "chrome-launcher/dist/utils";

export default function findChrome(): string {
  const platform = getPlatform() as keyof typeof chromeFinder;

  let path: string | undefined;
  if (isFinder(platform)) {
    const paths = chromeFinder[platform]();
    if (paths.length > 0) {
      path = paths[0];
    }
  }

  if (path === undefined) {
    throw new Error(`Could not find a Chrome installation for ${platform}`);
  }

  return path;
}

type Platform = ReturnType<typeof getPlatform>;
type Supported = keyof typeof chromeFinder;

function isFinder(platform: Platform): platform is Supported {
  return platform in chromeFinder;
}
