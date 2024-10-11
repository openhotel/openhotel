import { RequestMethod, readYaml, writeYaml } from "@oh/utils";
import { System } from "./main.ts";

export const auth = () => {
  let $serverId: string;
  let $token: string;

  const load = async () => {
    if (!System.getConfig().auth.enabled) return;
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
    try {
      const { auth } = System.getConfig();
      const { data } = await fetch(`${auth.api}/server/register`, {
        method: RequestMethod.POST,
        body: JSON.stringify({
          version: System.getEnvs().version,
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
    } catch (e) {
      console.error(`/!\\ Auth server is not reachable!`);
    }
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
      `${System.getConfig().auth.api}/server${pathname}`,
      {
        method,
        body: data ? JSON.stringify(data) : null,
        headers,
      },
    ).then((response) => response.json());

    if (status !== 200) throw Error(`Status ${status}!`);

    return responseData as Data;
  };

  const getAuth = () => ({
    serverId: $serverId,
    token: $token,
  });

  return {
    load,
    fetch: $fetch,
    getAuth,
  };
};
