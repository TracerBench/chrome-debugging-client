import * as tmp from "tmp";

tmp.setGracefulCleanup();

export default function createTmpDir(dir?: string): [string, () => void] {
  const tmpDir = tmp.dirSync({
    dir, // base dir defaults to system temporary directory
    unsafeCleanup: true, // recursive like rm -r
  });
  return [tmpDir.name, tmpDir.removeCallback];
}
