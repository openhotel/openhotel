import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

type FetchProps = {
  method?: RequestMethod;
  pathname: string;
  data?: unknown;
  overrideEnabled?: boolean;
  headers?: Record<string, string>;
};

export const auth = () => {
  let isEnabled = false;

  const $checkToken = async () => {
    try {
      const { valid } = await $fetch<any>({
        method: RequestMethod.GET,
        pathname: "/tokens/check",
        overrideEnabled: true,
      });
      isEnabled = valid;
      if (!valid) console.error("/!\\ Auth Token is not valid!");
    } catch (e) {
      console.error("/!\\ Auth service is down!");
      console.error(e);
      isEnabled = false;
    }
  };

  const load = async () => {
    if (System.isDevelopment()) return;

    Deno.cron("Check token", "*/30 * * * *", async () => {
      await $checkToken();
    });
    await $checkToken();
  };

  const $fetch = async <Data>({
    method = RequestMethod.GET,
    pathname,
    data,
    headers = {},
    overrideEnabled = false,
  }: FetchProps): Promise<Data> => {
    if (!isEnabled && !overrideEnabled) return null as Data;

    const config = System.getConfig();

    const { status, data: responseData } = await fetch(
      `${config.auth.api}${pathname}`,
      {
        method,
        body: data ? JSON.stringify(data) : null,
        headers: new Headers({
          ...headers,
          "app-token": config.auth.token,
        }),
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
