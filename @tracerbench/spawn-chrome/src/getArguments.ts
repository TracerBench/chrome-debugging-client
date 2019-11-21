import { ArgumentOptions } from "../types";

import defaultFlags, { headlessFlags } from "./defaultFlags";

export default function getArguments(
  userDataDir: string,
  options: ArgumentOptions
): string[] {
  let args = [
    "--remote-debugging-pipe",
    `--user-data-dir=${userDataDir}`
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

  args = cleanupArgs(args);

  if (options.url !== undefined) {
    args.push(options.url);
  }

  return args;
}

function cleanupArgs(args: string[]) {
  const set = new Set<string>();
  const disabledFeatures = new Set<string>();
  const enabledFeatures = new Set<string>();
  for (const arg of args) {
    if (parseCommaDelimitedArg(enabledFeatures, "--enable-features=", arg)) {
      continue;
    }
    if (parseCommaDelimitedArg(disabledFeatures, "--disable-features=", arg)) {
      continue;
    }
    set.add(arg);
  }
  const cleaned = Array.from(set);
  if (enabledFeatures.size > 0) {
    cleaned.push(
      `--enable-features=${formatCommaDelimitedArg(enabledFeatures)}`
    );
  }
  if (disabledFeatures.size > 0) {
    cleaned.push(
      `--disable-features=${formatCommaDelimitedArg(disabledFeatures)}`
    );
  }
  return cleaned;
}

function parseCommaDelimitedArg(
  set: Set<string>,
  prefix: string,
  arg: string
): boolean {
  if (arg.startsWith(prefix)) {
    for (const item of arg.slice(prefix.length).split(",")) {
      set.add(item);
    }
    return true;
  }
  return false;
}

function formatCommaDelimitedArg(set: Set<string>) {
  return Array.from(set).join(",");
}
