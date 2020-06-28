import type { Complete } from "race-cancellation";
import { oneshot } from "race-cancellation";

import type { Response } from "../types";

export default function newResponses(): [UsingResponse, ResolveResponse] {
  let seq = 0;
  const pending = new Map<number, (response: Response) => void>();

  return [usingResponse, resolveResponse];

  function resolveResponse(response: Response): void {
    const resolve = pending.get(response.id);
    if (resolve !== undefined) {
      resolve(response);
    }
  }

  async function usingResponse<Result extends object | void>(
    using: UsingResponseCallback<Result>,
  ): Promise<Response<Result>> {
    const id = seq++;
    try {
      const [response, resolve] = oneshot<Response<Result>>();
      pending.set(id, resolve as Complete<Response>);
      return await using(id, response);
    } finally {
      pending.delete(id);
    }
  }
}

export type ResolveResponse = (response: Response) => void;

export type UsingResponse = <Result extends object | void>(
  using: UsingResponseCallback<Result>,
) => Promise<Response<Result>>;

export type UsingResponseCallback<Result extends object | void> = (
  id: number,
  response: () => Promise<Response<Result>>,
) => Promise<Response<Result>>;
