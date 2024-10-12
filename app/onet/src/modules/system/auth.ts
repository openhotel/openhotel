import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const auth = () => {
  const load = async () => {
    try {
      await $fetch(RequestMethod.GET, "/onet/validate");
    } catch (e) {
      console.error("cannot connect to auth service!");
      console.error(e);
    }
  };

  const $fetch = async <Data>(
    method: RequestMethod,
    pathname: string,
    data?: unknown,
  ): Promise<Data> => {
    const config = System.getConfig();

    const headers = new Headers();
    headers.append("onet-key", config.auth.key);

    const { status, data: responseData } = await fetch(
      `${config.auth.api}${pathname}`,
      {
        method,
        body: data ? JSON.stringify(data) : null,
        headers,
      },
    ).then((response) => response.json());

    console.log(status)
    if (status !== 200) throw Error(`Status ${status}!`);

    return responseData as Data;
  };

  return {
    load,
    fetch: $fetch,
  };
};
