import type {
  AttachMessageTransport,
  OnClose,
  OnMessage,
  SendMessage,
} from "@tracerbench/message-transport";
import type { Cancellation, RaceCancellation, Task } from "race-cancellation";
import { disposablePromise } from "race-cancellation";
import NodeWebSocket = require("ws");

export type {
  AttachMessageTransport,
  OnClose,
  OnMessage,
  SendMessage,
  Cancellation,
  RaceCancellation,
  Task,
};
export type CloseWebSocket = () => void;

export default async function openWebSocket(
  url: string,
  raceCancellation?: RaceCancellation,
): Promise<[AttachMessageTransport, CloseWebSocket]> {
  const ws = new NodeWebSocket(url);
  let lastError: Error | undefined;

  ws.on("error", (err: Error) => {
    lastError = err;
  });

  await disposablePromise((resolve, reject) => {
    ws.on("open", resolve);
    ws.on("close", onClose);
    function onClose(): void {
      let message = `Failed to open ${url}`;
      if (lastError !== undefined && lastError.stack) {
        message += `: ${lastError.stack}`;
      }
      reject(new Error(message));
    }
    return () => {
      ws.removeListener("open", resolve);
      ws.removeListener("close", onClose);
    };
  }, raceCancellation);

  return [
    (onMessage, onClose) => {
      // we should be open still when attach is called
      // but double check here
      if (ws.readyState !== ws.OPEN) {
        setImmediate(handleClose);
      }

      let called = false;
      function handleClose(): void {
        if (called) {
          return;
        }
        called = true;
        ws.removeListener("message", onMessage);
        ws.removeListener("close", handleClose);
        onClose(lastError);
      }

      ws.on("message", onMessage);
      ws.on("close", handleClose);
      return (message) => ws.send(message);
    },
    () => ws.close(),
  ];
}
