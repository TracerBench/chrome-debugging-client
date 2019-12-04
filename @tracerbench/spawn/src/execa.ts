import execa = require("execa");

export default function wrappedExec(
  command: string,
  args: string[],
  opts: execa.Options,
  debugCallback: (formatter: string, ...args: unknown[]) => void,
): execa.ExecaChildProcess<string> {
  const child = execa(command, args, opts);
  debugCallback(
    "execa(%o, %O, %O) => ChildProcess (pid: %o)",
    command,
    args,
    opts,
    child.pid,
  );

  // even though the child promise is a promise of exit
  // it rejects on being signalled
  child.catch(() => {
    // ignore unhandled rejection from sending signal
  });

  //
  return child;
}
