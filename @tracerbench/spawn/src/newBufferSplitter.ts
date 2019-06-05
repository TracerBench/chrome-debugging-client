export type SplitterCallback = (split: Buffer) => void;

export interface BufferSplitter {
  stop(): void;
  push(chunk: Buffer): void;
  flush(): void;
}

export default function newBufferSplitter(
  char: number,
  callback: SplitterCallback,
): BufferSplitter {
  const buffers: Buffer[] = [];
  let byteLength = 0;
  let stopped = false;

  return {
    flush,
    push,
    stop,
  };

  function push(chunk: Buffer): void {
    if (stopped) {
      return;
    }

    let start = 0;
    let end = chunk.indexOf(char);

    while (end !== -1) {
      _push(chunk, start, end);

      _flush();

      if (stopped) {
        return;
      }

      start = end + 1;
      end = chunk.indexOf(char, start);
    }

    // append remainder
    _push(chunk, start, chunk.length);
  }

  function flush() {
    if (stopped) {
      return;
    }

    _flush();
  }

  function stop() {
    stopped = true;
    byteLength = 0;
    buffers.length = 0;
  }

  function _push(buffer: Buffer, start: number, end: number) {
    const length = end - start;
    if (length > 0) {
      if (length !== buffer.byteLength) {
        buffer = buffer.slice(start, end);
      }
      buffers.push(buffer);
      byteLength += length;
    }
  }

  function _flush() {
    let split: Buffer | undefined;

    if (byteLength === 0) {
      return;
    }

    if (buffers.length === 1) {
      split = buffers[0];
    } else if (buffers.length > 1) {
      split = Buffer.concat(buffers, byteLength);
    }

    buffers.length = 0;
    byteLength = 0;

    if (split !== undefined) {
      callback(split);
    }
  }
}
