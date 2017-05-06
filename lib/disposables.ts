import { IDisposable } from "./types";

export default class Disposables implements IDisposable {
  private disposables: IDisposable[] = [];

  public add(disposable: IDisposable): void {
    this.disposables.push(disposable);
  }

  public async dispose(): Promise<void> {
    const { disposables } = this;
    for (let i = disposables.length - 1; i >= 0; i--) {
      try {
        await disposables[i].dispose();
        disposables.length = i;
      } catch (e) {
        /* tslint:disable:no-console */
        console.error(e);
        /* tslint:enable:no-console */
      }
    }
  }
}
