/**
 * Attaches a message transport with the specified message callback and close callback.
 *
 * If an error occurs in the underlying transport it is expected the transport closes and calls the
 * close callback with the error, otherwise if the transport is closed normally the
 * callback will be called with no args.
 *
 * Each message should be received with its own event frame with its own microtask queue.
 *
 * @param onMessage receives messages
 * @param onClose called when the tranport closes, in an abnormal close it is called with the error
 */
export type AttachMessageTransport = (
  onMessage: OnMessage,
  onClose: OnClose,
) => SendMessage;

export type OnMessage = (message: string) => void;
export type OnClose = (error?: Error) => void;
export type SendMessage = (message: string) => void;
