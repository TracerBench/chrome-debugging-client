import { Disposable } from "./common";
import { tmpdir } from "os";
import * as path from "path";
import * as mktemp from "mktemp";
import * as rimraf from "rimraf";

export interface TmpDirCreator {
  create(): Promise<TmpDir>;
}

export interface TmpDir extends Disposable {
  path: string;
}

export default class TmpDirCreatorImpl implements TmpDirCreator {
  async create(): Promise<Disposable> {
    let templatePath = path.join(tmpdir(), "tmpXXXXXX");
    let tmpDirPath = await new Promise<string>((resolve, reject) => {
      mktemp.createDir(templatePath, (err, path) => err ? reject(err) : resolve(path));
    });
    return new TmpDirImpl(tmpDirPath);
  }
}

class TmpDirImpl implements TmpDir {
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  dispose(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      rimraf(this.path, err => err ? reject(err) : resolve());
    }).catch(err => console.error(err));
  }
}
