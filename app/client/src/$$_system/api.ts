import { System } from "system/system";

export const api = () => {
  const $fetch = async <Data>(
    pathname: string,
    data: Record<string | number, string | number | boolean> = {},
    ignoreStatus: boolean = false,
    method = "GET",
  ): Promise<Data> => {
    const { accountId, apiToken } = System.game.users.getCurrentUser();
    const searchParams = new URLSearchParams();
    for (const key of Object.keys(data)) searchParams.set(key, data[key] + "");

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

    if (ignoreStatus) return $data as Data;

    const { status, data: responseData } = $data;
    if (!status) throw Error(`Status ${status}!`);

    return responseData as Data;
  };

  const getPath = (pathname: string) => {
    const isDevelopment = System.config.isDevelopment();
    return `${isDevelopment ? "proxy" : ""}/api${pathname}`;
  };

  return {
    fetch: $fetch,
    getPath,
  };
};
