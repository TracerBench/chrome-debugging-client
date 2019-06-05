import { ProcessWithPipeMessageTransport, Stdio } from "@tracerbench/spawn";

export interface ArgumentOptions {
  /**
   * The url to open chrome at.
   */
  url: string | undefined;

  /**
   * Disable the defaults flags.
   *
   * It still will add `--remote-debugging-pipe` and `--user-data-dir`.
   */
  disableDefaultArguments: boolean;

  /**
   * Additional arguments to the defaults.
   */
  additionalArguments: string[] | undefined;

  /**
   * Provide default headless arguments.
   */
  headless: boolean;
}

export interface SpawnOptions extends ArgumentOptions {
  /**
   * Whether the stdio output should be inherited or ignored.
   */
  stdio: Stdio;

  /**
   * Override finding the chrome executable.
   */
  chromeExecutable: string | undefined;

  /**
   * Explicitly provide a user data directory.
   *
   * If there is already a chrome process running using this directory,
   * the spawn will fail.
   */
  userDataDir: string | undefined;

  /**
   * The root directory for creating the user data tmp dir.
   */
  userDataRoot: string | undefined;
}

export interface Chrome extends ProcessWithPipeMessageTransport {
  userDataDir: string;
}
