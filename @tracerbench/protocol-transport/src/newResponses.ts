import { oneshot } from "race-cancellation";

import { Response } from "../types";

export default function newResponses(): [UsingResponse, ResolveResponse] {
  let seq = 0;
  const pending = new Map<number, (response: Response<any>) => void>();

  return [usingResponse, resolveResponse];

  function resolveResponse(response: Response<any>) {
    const resolve = pending.get(response.id);
    if (resolve !== undefined) {
      resolve(response);
    }
  }

  async function usingResponse<Result extends object>(
    using: UsingResponseCallback<Result>,
  ) {
    const id = seq++;
    try {
      const [response, resolve] = oneshot<Response<Result>>();
      pending.set(id, resolve);
      return await using(id, response);
    } finally {
      pending.delete(id);
    }
  }
}

export type ResolveResponse = (response: Response<any>) => void;

export type UsingResponse = <Result extends object>(
  using: UsingResponseCallback<Result>,
) => Promise<Response<Result>>;

export type UsingResponseCallback<Result extends object> = (
  id: number,
  response: () => Promise<Response<Result>>,
) => Promise<Response<Result>>;
