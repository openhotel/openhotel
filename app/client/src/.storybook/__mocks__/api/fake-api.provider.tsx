import React, { useCallback } from "react";
import { ApiContext } from "../../../shared/hooks";
import { FAKE_API_CALLS_DATA } from "./fake-api.consts";

export const FakeApiProvider = ({ children }) => {
  const $fetch = useCallback(
    async (
      pathname: string,
      data: Record<string | number, string | number | boolean> = {},
      ignoreStatus: boolean = false,
      method = "GET",
    ): Promise<unknown> => {
      const searchParams = new URLSearchParams(pathname.split("?")[1]);

      const response = FAKE_API_CALLS_DATA.find(
        (call) => pathname.startsWith(call.pathname) && call.method === method,
      )?.response({
        pathname,
        data,
        searchParams,
      });
      if (!response)
        throw Error(`[${method} ${pathname}] CALL NOT IMPLEMENTED!`);
      return response;
    },
    [],
  );

  return (
    <ApiContext.Provider
      value={{
        fetch: $fetch,
      }}
      children={children}
    />
  );
};
