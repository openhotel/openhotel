import { RequestMethod } from "@oh/utils";
import { Proxy } from "modules/proxy/main.ts";

export const auth = () => {
  let $serverId: string;
  let $token: string;

  const load = async (serverId: string, token: string) => {
    $serverId = serverId;
    $token = token;
  };

  const $fetch = async <Data>(
    method: RequestMethod,
    pathname: string,
    data?: unknown,
  ): Promise<Data> => {
    const headers = new Headers();
    headers.append("server-id", $serverId);
    headers.append("token", $token);

    const { status, data: responseData } = await fetch(
      `${Proxy.getConfig().auth.api}/server${pathname}`,
      {
        method,
        body: data ? JSON.stringify(data) : null,
        headers,
      },
    ).then((response) => response.json());

    if (status !== 200) throw Error(`Status ${status}!`);

    return responseData as Data;
  };

  return {
    load,
    fetch: $fetch,
  };
};
