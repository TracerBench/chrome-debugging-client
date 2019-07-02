import { Transform, TransformCallback } from "stream";

import newBufferSplitter from "./newBufferSplitter";

const WS_URL_REGEX = /^(?:DevTools|Debugger) listening on (ws:\/\/\d+\.\d+\.\d+\.\d+:\d+\/.+$)/;

const enum Char {
  LF = 10,
  CR = 13,
}

const PASSTHROUGH: ParserState = {
  transform(chunk, _encoding, callback) {
    callback(undefined, chunk);
  },
  flush(callback) {
    callback();
  },
};

interface ParserState {
  transform(chunk: Buffer, encoding: string, callback: TransformCallback): void;
  flush(callback: TransformCallback): void;
}

export type UrlParsedCallback = (url: string) => void;

export default function newWebSocketUrlParser(
  onUrlParsed: UrlParsedCallback,
): NodeJS.ReadWriteStream {
  let state = createParsingState(url => {
    onUrlParsed(url);
    state = PASSTHROUGH;
  });
  return new Transform({
    transform(chunk, encoding, callback) {
      state.transform(chunk, encoding, callback);
    },
    flush(callback) {
      state.flush(callback);
    },
  });
}

function createParsingState(onUrlParsed: UrlParsedCallback): ParserState {
  const splitter = newBufferSplitter(Char.LF, split => {
    const url = findUrl(split);
    if (url !== undefined) {
      splitter.stop();
      onUrlParsed(url);
    }
  });

  return {
    transform(chunk, _encoding, callback) {
      splitter.push(chunk);
      callback(undefined, chunk);
    },
    flush(callback) {
      splitter.flush();
      callback();
    },
  };
}

function findUrl(split: Buffer): string | undefined {
  let length = split.byteLength;

  // check CR LF
  if (length > 0 && split[length - 1] === Char.CR) {
    length--;
  }

  if (length === 0) {
    return;
  }

  const line = split.toString("utf8", 0, length);
  const match = WS_URL_REGEX.exec(line);
  if (match !== null) {
    const [, url] = match;
    return url;
  }
}
