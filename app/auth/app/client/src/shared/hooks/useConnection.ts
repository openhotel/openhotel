import { useApi } from "./useApi";
import { useCallback } from "react";
import { RequestMethod } from "shared/enums";
import { useAccount } from "./useAccount";

export const useConnection = () => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const remove = useCallback(
    async (hostname: string) => {
      return fetch({
        method: RequestMethod.DELETE,
        pathname: `/user/@me/connection?hostname=${hostname}`,
        headers: getAccountHeaders(),
      });
    },
    [fetch, getAccountHeaders],
  );

  const getList = useCallback(async () => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: "/user/@me/connection",
      headers: getAccountHeaders(),
    });

    return data.hosts;
  }, []);

  const get = useCallback(async (hostname: string) => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: `/user/@me/connection?hostname=${hostname}`,
      headers: getAccountHeaders(),
    });

    return data.host;
  }, []);

  const add = useCallback(
    async (state: string, redirectUrl: string, scopes: string[]) => {
      return fetch({
        method: RequestMethod.POST,
        pathname: `/user/@me/connection`,
        headers: getAccountHeaders(),
        body: { state, redirectUrl, scopes },
      });
    },
    [fetch, getAccountHeaders],
  );

  const ping = useCallback(async (connectionId: string) => {
    const { data } = await fetch({
      method: RequestMethod.PATCH,
      pathname: `/user/@me/connection/ping?connectionId=${connectionId}`,
      headers: getAccountHeaders(),
    });

    return data;
  }, []);

  return {
    add,
    remove,
    get,
    getList,
    ping,
  };
};
