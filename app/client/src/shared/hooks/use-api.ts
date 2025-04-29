import { useCallback } from "react";
import { useAccount, useApiPath } from "shared/hooks";

export const useApi = () => {
  const { getAccount } = useAccount();
  const { getPath } = useApiPath();

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
    [getAccount, getPath],
  );

  return { fetch: $fetch };
};
