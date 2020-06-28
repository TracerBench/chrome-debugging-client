import type { ErrorResponse, ProtocolError, Request } from "../types";

export default function newProtocolError(
  request: Request,
  response: ErrorResponse,
): ProtocolError {
  const error = new Error(response.error.message) as ProtocolError;
  error.name = "ProtocolError";
  error.request = request;
  error.response = response;
  return error;
}

export function isProtocolError(error: Error): error is ProtocolError {
  return (
    error.name === "ProtocolError" && "request" in error && "response" in error
  );
}
