import { System } from "system/system";

export const api = () => {
  const $fetch = async <Data>(
    pathname: string,
    data: Record<string | number, string | number | boolean> = {},
    ignoreStatus: boolean = false,
  ): Promise<Data> => {
    const { accountId, apiToken } = System.game.users.getCurrentUser();
    const searchParams = new URLSearchParams();
    for (const key of Object.keys(data)) searchParams.set(key, data[key] + "");

    const headers = new Headers();
    headers.append("accountId", accountId);
    headers.append("token", apiToken);

    const params = searchParams.toString();
    const $data = await fetch(
      getPath(pathname + (params ? `?${params}` : "")),
      {
        headers,
      },
    ).then((response) => response.json());

    if (ignoreStatus) return $data as Data;

    const { status, data: responseData } = $data;
    if (!status) throw Error(`Status ${status}!`);

    return responseData as Data;
  };

  const getPath = (pathname: string) => {
    const isDevelopment = System.version.isDevelopment();
    return `${isDevelopment ? "proxy" : ""}/api${pathname}`;
  };

  return {
    fetch: $fetch,
    getPath,
  };
};
