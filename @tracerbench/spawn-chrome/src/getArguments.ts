import { ArgumentOptions } from "../types";

import defaultFlags, { headlessFlags } from "./defaultFlags";

export default function getArguments(
  userDataDir: string,
  options: ArgumentOptions,
): string[] {
  const args = [
    "--remote-debugging-pipe",
    `--user-data-dir=${userDataDir}`,
  ] as string[];
  if (!options.disableDefaultArguments) {
    args.push(...defaultFlags);
  }
  if (options.additionalArguments !== undefined) {
    args.push(...options.additionalArguments);
  }
  if (options.headless) {
    args.push(...headlessFlags);
  }
  if (options.url !== undefined) {
    args.push(options.url);
  }
  return args;
}
