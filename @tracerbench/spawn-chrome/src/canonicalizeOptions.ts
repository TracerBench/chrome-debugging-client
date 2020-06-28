import type { ChromeSpawnOptions } from "../types";

const CANONICALIZE: {
  [K in keyof ChromeSpawnOptions]: Canonicalize<ChromeSpawnOptions[K]>;
} & {
  [key: string]: Canonicalize<ChromeSpawnOptions[keyof ChromeSpawnOptions]>;
} = {
  additionalArguments: arrayOf("string"),
  chromeExecutable: primitive("string"),
  disableDefaultArguments: primitive("boolean"),
  headless: primitive("boolean"),
  stdio: enumOf("inherit", "ignore"),
  url: primitive("string"),
  userDataDir: primitive("string"),
  userDataRoot: primitive("string"),
  cwd: primitive("string"),
  extendEnv: primitive("boolean"),
  env: env(),
};

type Canonicalize<T> = (value: unknown, key: string) => T;

interface PrimitiveMapping {
  boolean: boolean;
  string: string;
}

function primitive<T extends keyof PrimitiveMapping>(
  type: T,
): Canonicalize<PrimitiveMapping[T]> {
  return (value, key) => {
    if (typeof value === type) {
      return value as PrimitiveMapping[T];
    }
    return invalidOption(key, type);
  };
}

function enumOf<T extends readonly string[]>(
  ...tuple: T
): Canonicalize<T[Exclude<keyof T, keyof string[]>]> {
  return (value, key) => {
    if (typeof value === "string") {
      if (tuple.includes(value)) {
        return (value as unknown) as T[Exclude<keyof T, keyof string[]>];
      }
    }
    return invalidOption(key, tuple.map((v) => JSON.stringify(v)).join(" | "));
  };
}

function arrayOf<T extends keyof PrimitiveMapping>(
  type: T,
): Canonicalize<Array<PrimitiveMapping[T]>> {
  return (array, key) => {
    if (Array.isArray(array)) {
      for (const value of array) {
        if (typeof value !== type) {
          return invalidOption(key, `${type}[]`);
        }
      }
      return array as PrimitiveMapping[T][];
    }
    return invalidOption(key, `${type}[]`);
  };
}

function env(): Canonicalize<{ [name: string]: string | undefined }> {
  return (value, key) => {
    if (isObject(value)) {
      return value as { [name: string]: string | undefined };
    }
    return invalidOption(key, "env");
  };
}

export default function canonicalizeOptions(
  options: unknown,
): ChromeSpawnOptions {
  const canonical: ChromeSpawnOptions & {
    [key: string]: ChromeSpawnOptions[keyof ChromeSpawnOptions];
  } = {
    additionalArguments: undefined,
    chromeExecutable: undefined,
    disableDefaultArguments: false,
    headless: false,
    stdio: "ignore",
    url: undefined,
    userDataDir: undefined,
    userDataRoot: undefined,
    cwd: undefined,
    extendEnv: undefined,
    env: undefined,
  };

  if (isObject(options)) {
    for (const key of Object.keys(canonical)) {
      const value = options[key];
      if (value === undefined) {
        continue;
      }
      canonical[key] = CANONICALIZE[key](value, key);
    }
  }

  return canonical;
}

function isObject(
  options: unknown,
): options is {
  [key: string]: unknown;
} {
  return typeof options === "object" && options !== null;
}

function invalidOption(key: string, type: string): never {
  throw new TypeError(`invalid option ${key} expected value to be ${type}`);
}
