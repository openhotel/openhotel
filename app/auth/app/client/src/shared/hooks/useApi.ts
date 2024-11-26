import { Request } from "shared/types";
import { RequestMethod } from "../enums";
import { useCallback } from "react";

export const useApi = () => {
  const $fetch = useCallback(
    async ({
      method = RequestMethod.GET,
      pathname,
      body,
      headers = {},
    }: Request) => {
      const response = await fetch(`/api/v3${pathname}`, {
        method,
        headers: new Headers({
          ...headers,
          "Content-Type": "application/json",
        }),
        body: body ? JSON.stringify(body) : undefined,
      }).then((data) => data.json());

      if (response.status !== 200) throw response;

      return response;
    },
    [],
  );

  const getVersion = useCallback(async (): Promise<string> => {
    const {
      data: { version },
    } = await $fetch({
      method: RequestMethod.GET,
      pathname: "/version",
    });
    return version;
  }, [$fetch]);

  return {
    fetch: $fetch,
    getVersion,
  };
};
