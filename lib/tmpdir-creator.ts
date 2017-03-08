import { Disposable } from "./common";
import { tmpdir } from "os";
import * as path from "path";
import * as rimraf from "rimraf";

const mktemp: {
  createDir(template: string, callback: (err: Error, filename: string) => void);
} = require("mktemp");

export interface ITmpDirCreator {
  create(): Promise<ITmpDir>;
}

export interface ITmpDir extends Disposable {
  path: string;
}

export default class TmpDirCreator implements ITmpDirCreator {
  async create(): Promise<Disposable> {
    let templatePath = path.join(tmpdir(), "tmpXXXXXX");
    let tmpDirPath = await new Promise<string>((resolve, reject) => {
      mktemp.createDir(templatePath, (err, path) => err ? reject(err) : resolve(path));
    });
    return new TmpDir(tmpDirPath);
  }
}

class TmpDir implements ITmpDir {
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
