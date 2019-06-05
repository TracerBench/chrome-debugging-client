import { AttachMessageTransport } from "@tracerbench/message-transport";
import newBufferSplitter from "./newBufferSplitter";
import newTaskQueue from "./newTaskQueue";

export default function newPipeMessageTransport(
  writeStream: NodeJS.WriteStream,
  readStream: NodeJS.ReadStream,
): AttachMessageTransport {
  let attached = false;
  return (onMessage, onClose) => {
    if (attached) {
      throw new Error("already attached to transport");
    }
    attached = true;

    const enqueue = newTaskQueue();
    const splitter = newBufferSplitter(Char.NULL, buffer =>
      enqueue(() => onMessage(buffer.toString("utf8"))),
    );

    let closeEnqueued = false;
    const enqueueOnClose = (error?: Error) => {
      if (closeEnqueued) {
        return;
      }
      closeEnqueued = true;
      if (error) {
        enqueue(() => onClose(error));
      } else {
        enqueue(onClose);
      }
    };

    writeStream.on("error", enqueueOnClose);
    readStream.on("error", enqueueOnClose);
    readStream.on("close", enqueueOnClose);
    readStream.on("data", data => splitter.push(data));
    readStream.on("end", () => splitter.flush());

    return message => {
      writeStream.write(message + "\0");
    };
  };
}

const enum Char {
  NULL = 0,
}
