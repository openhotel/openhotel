import { System } from "system/system";

export const api = () => {
  const $fetch = async <Data>(
    pathname: string,
    data: Record<string | number, string | number | boolean> = {},
  ): Promise<Data> => {
    const { accountId, apiToken } = System.game.users.getCurrentUser();
    const searchParams = new URLSearchParams();
    for (const key of Object.keys(data)) searchParams.set(key, data[key] + "");

    const headers = new Headers();
    headers.append("accountId", accountId);
    headers.append("token", apiToken);

    const params = searchParams.toString();
    const { status, data: responseData } = await fetch(
      `/proxy/api${pathname}${params ? `?${params}` : ""}`,
      {
        headers,
      },
    ).then((response) => response.json());

    if (!status) throw Error(`Status ${status}!`);

    return responseData as Data;
  };
  return {
    fetch: $fetch,
  };
};
