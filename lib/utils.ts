import { EventEmitter } from "events";

export function eventPromise<T>(emitter: EventEmitter, resolveEvent: string, rejectEvent: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let resolveHandler = (evt) => {
      resolve(evt);
      emitter.removeListener(resolveEvent, resolveHandler);
      emitter.removeListener(rejectEvent, rejectHandler);
    }
    let rejectHandler = (evt) => {
      reject(evt);
      emitter.removeListener(resolveEvent, resolveHandler);
      emitter.removeListener(rejectEvent, rejectHandler);
    }
    emitter.on(resolveEvent, resolveHandler);
    emitter.on(rejectEvent, rejectHandler);
  });
}