export interface IDisposable {
  /* should not reject */
  dispose(): Promise<any>;
}

export interface IEventNotifier {
  on(event: string, listener: (evt?: any) => void): any;
  removeListener(event: string, listener: (evt?: any) => void): any;
  removeAllListeners(event?: string): any;
}

export function eventPromise<T>(emitter: IEventNotifier, resolveEvent: string, rejectEvent: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const resolveHandler = (evt: T) => {
      resolve(evt);
      emitter.removeListener(resolveEvent, resolveHandler);
      emitter.removeListener(rejectEvent, rejectHandler);
    };
    const rejectHandler = (evt: any) => {
      reject(evt);
      emitter.removeListener(resolveEvent, resolveHandler);
      emitter.removeListener(rejectEvent, rejectHandler);
    };
    emitter.on(resolveEvent, resolveHandler);
    emitter.on(rejectEvent, rejectHandler);
  });
}

export function delay(ms: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
