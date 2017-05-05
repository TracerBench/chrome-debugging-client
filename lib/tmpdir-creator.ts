import { tmpdir } from "os";
import { join } from "path";
import * as rimraf from "rimraf";
import { IDisposable } from "./common";

/* tslint:disable:no-var-requires */
const mktemp: {
  createDir(template: string, callback: (err: Error | undefined, path: string) => void): void;
} = require("mktemp");
/* tslint:enable:no-var-requires */

export interface ITmpDirCreator {
  create(): Promise<ITmpDir>;
}

export interface ITmpDir extends IDisposable {
  path: string;
}

export default class TmpDirCreator implements ITmpDirCreator {
  public async create(): Promise<ITmpDir> {
    const templatePath = join(tmpdir(), "tmpXXXXXX");
    const path = await new Promise<string>((resolve, reject) => {
      mktemp.createDir(templatePath, (e, p) => e ? reject(e) : resolve(p));
    });
    function dispose() {
      return new Promise<void>((resolve, reject) => {
        rimraf(path, (e) => e ? reject(e) : resolve());
      }).catch((e) => {
        /* tslint:disable:no-console */
        console.error(e);
        /* tslint:enable:no-console */
      });
    }
    return { path, dispose };
  }
}
