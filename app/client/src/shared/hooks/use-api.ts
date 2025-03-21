import { useCallback } from "react";
import { useAccount, useConfig } from "shared/hooks";

export const useApi = () => {
  const { isDevelopment } = useConfig();
  const { getAccount } = useAccount();

  const $fetch = useCallback(
    async (
      pathname: string,
      data: Record<string | number, string | number | boolean> = {},
      ignoreStatus: boolean = false,
      method = "GET",
    ): Promise<unknown> => {
      const { accountId, apiToken } = getAccount();
      const searchParams = new URLSearchParams();
      for (const key of Object.keys(data))
        searchParams.set(key, data[key] + "");

      const headers = new Headers();
      headers.append("accountId", accountId);
      headers.append("token", apiToken);

      const params = searchParams.toString();
      const $data = await fetch(
        getPath(pathname + (params && method === "GET" ? `?${params}` : "")),
        {
          headers,
          method,
          ...(method !== "GET" ? { body: JSON.stringify(data) } : {}),
        },
      ).then((response) => response.json());

      if (ignoreStatus) return $data;

      const { status, data: responseData } = $data;
      if (!status) throw Error(`Status ${status}!`);

      return responseData;
    },
    [getAccount],
  );

  const getPath = useCallback(
    (pathname: string) => {
      return `${isDevelopment() ? "proxy" : ""}/api${pathname}`;
    },
    [isDevelopment],
  );

  return { fetch: $fetch, getPath };
};
