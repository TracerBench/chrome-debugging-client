// @ts-check
const {
  default: openWebSocket,
} = require("@tracerbench/websocket-message-transport");
const { default: spawn } = require("@tracerbench/spawn");
const { disposablePromise } = require("race-cancellation");
const { EventEmitter } = require("events");
const debug = require("debug")("protocol");

main(`const obj = {
  hello: "world",
};
debugger;
console.log("end");`);

/**
 * @param {import('@tracerbench/spawn/types').ProcessWithWebSocketUrl} child
 * @param {import('race-cancellation').RaceCancellation} raceCancellation
 */
async function debugScript(child, raceCancellation) {
  console.log("wait for debugger url");
  const url = await child.url();

  console.log("open websocket %s", url);

  const [attach, close] = await openWebSocket(url, raceCancellation);

  const [send, until] = connection(attach, raceCancellation);

  console.log("wait for break on start");
  await Promise.all([
    until("Debugger.paused"),
    send("Debugger.enable"),
    send("Runtime.enable"),
    send("Runtime.runIfWaitingForDebugger"),
  ]);

  console.log("resume and wait for debugger statement");
  const [debuggerStatement] = await Promise.all([
    until("Debugger.paused"),
    send("Debugger.resume"),
  ]);

  console.log("hit debugger statement");

  console.log("eval obj variable");
  let result = await send("Debugger.evaluateOnCallFrame", {
    callFrameId: debuggerStatement.callFrames[0].callFrameId,
    expression: "obj",
    returnByValue: true,
  });
  console.log("result %O", result);

  console.log("resume until context destroyed");
  await Promise.all([
    until("Runtime.executionContextDestroyed"),
    send("Debugger.resume"),
  ]);

  console.log("close websocket");
  close();

  console.log("wait for exit");
  await child.waitForExit();

  console.log("node exited");
}

async function main(script) {
  console.log("spawn node");

  const child = spawn(
    process.execPath,
    ["--inspect-brk=0", "-e", script],
    "inherit",
    "websocket",
  );
  try {
    await debugScript(child, child.raceExit);
  } finally {
    console.log("finally");
    await child.dispose();
  }
}

/**
 * @param {import('@tracerbench/message-transport').AttachMessageTransport} attach
 * @param {import('race-cancellation').RaceCancellation} raceCancellation
 */
function connection(attach, raceCancellation) {
  let seq = 0;
  let events = new EventEmitter();
  let results = new Map();

  const sendMessage = attach(
    data => handleMessage(data),
    error => {
      if (error) {
        events.emit("error", error);
      }
      debug("close");
    },
  );

  return [send, until];

  function handleMessage(data) {
    const message = JSON.parse(data);
    debug("RECV %O", message);
    if ("id" in message) {
      const resolve = results.get(message.id);
      if (resolve) resolve(message.result);
    } else events.emit(message.method, message.params);
  }

  async function send(method, params) {
    const id = ++seq;
    const message = {
      id,
      method,
      params,
    };
    debug("SEND %O", message);
    try {
      sendMessage(JSON.stringify(message));
      return await raceCancellation(
        () =>
          new Promise(resolve => {
            results.set(id, resolve);
          }),
      );
    } finally {
      results.delete(id);
    }
  }

  function until(event) {
    return disposablePromise(resolve => {
      events.on(event, resolve);
      return () => events.removeListener(event, resolve);
    }, raceCancellation);
  }
}
