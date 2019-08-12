import { AttachMessageTransport } from "@tracerbench/message-transport";

import newBufferSplitter from "./newBufferSplitter";
import newTaskQueue from "./newTaskQueue";

export type Write = (data: Buffer) => void;
export type EndWrite = () => void;
export type OnRead = (chunk: Buffer) => void;
export type OnReadEnd = () => void;
export type OnClose = (err?: Error) => void;

export type AttachProcess = (
  onRead: OnRead,
  onReadEnd: OnReadEnd,
  onClose: OnClose,
) => [Write, EndWrite];

export default function newPipeMessageTransport(
  connect: AttachProcess,
): AttachMessageTransport {
  let attached = false;
  let closed = false;

  return (onMessage, onClose) => {
    if (attached) {
      throw new Error("already attached to transport");
    }
    attached = true;

    const [write, endWrite] = connect(
      onRead,
      onReadEnd,
      enqueueClose,
    );

    const enqueue = newTaskQueue();
    const splitter = newBufferSplitter(Char.NULL, split =>
      enqueueMessage(split.toString("utf8")),
    );

    return sendMessage;

    function enqueueClose(error?: Error) {
      if (closed) {
        return;
      }

      closed = true;

      if (error) {
        enqueue(() => onClose(error));
      } else {
        enqueue(onClose);
      }

      endWrite();
    }

    function enqueueMessage(message: string) {
      enqueue(() => onMessage(message));
    }

    function onRead(data: Buffer) {
      splitter.push(data);
    }

    function onReadEnd() {
      splitter.flush();
    }

    function sendMessage(message: string) {
      write(Buffer.from(message + "\0", "utf8"));
    }
  };
}

const enum Char {
  NULL = 0,
}
