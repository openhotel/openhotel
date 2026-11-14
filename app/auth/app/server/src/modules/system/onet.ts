import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

type FetchProps = {
  method?: RequestMethod;
  pathname: string;
  data?: unknown;
  body?: BodyInit;
  headers?: Record<string, string>;
};

type FetchResponse<Data> = {
  status: number;
  data: Data;
};

export const onet = () => {
  const load = async () => {
    const { enabled, api, token } = System.getConfig().onet;

    if (!enabled || !api || !token) {
      console.warn("Onet is disabled!");
      return;
    }

    try {
      const { status, data } = await $fetch<{ valid: boolean }>({
        pathname: "/auth/check",
      });

      if (status !== 200 || !data?.valid) {
        console.error("Onet token is not valid!");
      }
    } catch (e) {
      console.error("Onet service is down!");
      console.error(e);
    }
  };

  const $fetch = async <Data>({
    method = RequestMethod.GET,
    pathname,
    data,
    body,
    headers = {},
  }: FetchProps): Promise<FetchResponse<Data>> => {
    const { api, token } = System.getConfig().onet;

    const response = await fetch(`${api}${pathname}`, {
      method,
      body: body ?? (data !== undefined ? JSON.stringify(data) : null),
      headers: new Headers({
        ...headers,
        "app-token": token,
      }),
    });

    const json = await response.json().catch(() => ({}));
    return { status: response.status, data: json?.data as Data };
  };

  return {
    load,
    fetch: $fetch,
  };
};
