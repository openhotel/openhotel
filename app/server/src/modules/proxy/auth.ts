import { RequestMethod, readYaml, writeYaml } from "@oh/utils";
import { Proxy } from "modules/proxy/main.ts";

export const auth = () => {
  let $serverId: string;
  let $token: string;

  const load = async () => {
    if (Proxy.getConfig().development) return;
    try {
      const { serverId, token } = await readYaml("./server.key", {
        decode: true,
      });
      $serverId = serverId;
      $token = token;
      await $validate();
    } catch (e) {
      await $register();
    }
  };

  const $register = async () => {
    const { auth } = Proxy.getConfig();
    const { data } = await fetch(`${auth.api}/register`, {
      method: RequestMethod.POST,
      body: JSON.stringify({
        version: Proxy.getEnvs().version,
        ip: auth.redirectUrl,
      }),
    }).then((response) => response.json());

    const { serverId, token } = data;
    await writeYaml(
      "./server.key",
      {
        serverId,
        token,
      },
      { encode: true },
    );

    $serverId = serverId;
    $token = token;
  };

  const $validate = async () => {
    try {
      await $fetch(RequestMethod.GET, "/validate");
    } catch (e) {
      await $register();
    }
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
      `${Proxy.getConfig().auth.api}${pathname}`,
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
