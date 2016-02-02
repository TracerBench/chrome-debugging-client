export interface Disposable {
  /* should not reject */
  dispose(): Promise<any>;
}

export interface EventNotifier {
  on(event: string, listener: Function): any;
  removeListener(event: string, listener: Function): any;
  removeAllListeners(event?: string): any;
}

export function eventPromise<T>(emitter: EventNotifier, resolveEvent: string, rejectEvent: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let resolveHandler = evt => {
      resolve(evt);
      emitter.removeListener(resolveEvent, resolveHandler);
      emitter.removeListener(rejectEvent, rejectHandler);
    };
    let rejectHandler = evt => {
      reject(evt);
      emitter.removeListener(resolveEvent, resolveHandler);
      emitter.removeListener(rejectEvent, rejectHandler);
    };
    emitter.on(resolveEvent, resolveHandler);
    emitter.on(rejectEvent, rejectHandler);
  });
}

export function delay(ms: number): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, ms));
}