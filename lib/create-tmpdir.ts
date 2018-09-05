import * as tmp from "tmp";
import { IDisposable } from "./types";

tmp.setGracefulCleanup();

export interface ITmpDir extends IDisposable {
  path: string;
}

export default async function createTmpDir(
  customRoot?: string,
): Promise<ITmpDir> {
  const options: tmp.Options = {
    unsafeCleanup: true,
  };
  if (customRoot !== undefined) {
    options.dir = customRoot;
  }
  const tmpDir = tmp.dirSync(options);
  return {
    path: tmpDir.name,
    dispose() {
      try {
        tmpDir.removeCallback();
      } catch (e) {
        /* tslint:disable:no-console */
        console.error(e);
        /* tslint:enable:no-console */
      }
      return Promise.resolve();
    },
  };
}
