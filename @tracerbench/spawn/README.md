# @tracerbench/spawn

Higher level API `execa` to spawn a process with either an `AttachMessageTransport`
using "\0" delimited messages stdio pipes 3 and 4 or parses the stderr
stream for a devtools websocket URL.
