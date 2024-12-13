import { useApi } from "./useApi";
import { RequestMethod } from "shared/enums";
import {
  AccountChangePassProps,
  AccountLoginProps,
  AccountRecoverPassProps,
  AccountRegisterProps,
} from "shared/types";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "./useCookies";

export const useAccount = () => {
  const { fetch } = useApi();
  const { set: setCookie, get: getCookie, remove: removeCookie } = useCookies();

  const [isLogged, setIsLogged] = useState<boolean>(null);

  useEffect(() => {
    refresh()
      .then(() => setIsLogged(true))
      .catch(() => setIsLogged(false));
  }, []);

  const getAccountHeaders = useCallback(
    () => ({
      "account-id": getCookie("account-id"),
      token: getCookie("token"),
    }),
    [getCookie],
  );

  const login = useCallback(
    async (body: AccountLoginProps) => {
      const {
        data: {
          accountId,
          token,
          refreshToken,
          durations: [tokenDuration, refreshTokenDuration],
        },
      } = await fetch({
        method: RequestMethod.POST,
        pathname: "/account/login",
        body,
      });

      setCookie("account-id", accountId, refreshTokenDuration);
      setCookie("refresh-token", refreshToken, refreshTokenDuration);
      setCookie("token", token, tokenDuration);
    },
    [fetch, setCookie],
  );

  const register = useCallback(
    async (body: AccountRegisterProps) =>
      fetch({
        method: RequestMethod.POST,
        pathname: "/account/register",
        body,
      }),
    [fetch],
  );

  const logout = useCallback(async () => {
    fetch({
      method: RequestMethod.POST,
      pathname: "/account/logout",
      headers: getAccountHeaders(),
    });

    removeCookie("account-id");
    removeCookie("refresh-token");
    removeCookie("token");
  }, [fetch, getAccountHeaders, removeCookie]);

  const recoverPassword = useCallback(
    async (body: AccountRecoverPassProps) =>
      fetch({
        method: RequestMethod.POST,
        pathname: "/account/recover-password",
        body,
      }),
    [fetch],
  );

  const changePassword = useCallback(
    async (body: AccountChangePassProps) =>
      fetch({
        method: RequestMethod.POST,
        pathname: "/account/change-password",
        body,
      }),
    [fetch],
  );

  const refresh = useCallback(async () => {
    let accountId = getCookie("account-id");
    let token = getCookie("token");
    let refreshToken = getCookie("refresh-token");

    if (!accountId || (!token && !refreshToken)) throw "Not logged";

    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: "/account/refresh",
      headers: {
        "account-id": getCookie("account-id"),
        token: getCookie("token"),
        "refresh-token": getCookie("refresh-token"),
      },
    });
    if (!data) return;

    token = data.token;
    refreshToken = data.refreshToken;
    const [tokenDuration, refreshTokenDuration] = data.durations;

    setCookie("account-id", accountId, refreshTokenDuration);
    setCookie("refresh-token", refreshToken, refreshTokenDuration);
    setCookie("token", token, tokenDuration);
  }, [fetch, setCookie, getCookie]);

  console.log(getCookie("account-id"));
  const setAsAdmin = useCallback(() => {
    return fetch({
      method: RequestMethod.POST,
      pathname: "/admin",
      headers: getAccountHeaders(),
    });
  }, []);

  const verify = useCallback(
    async (id: string, token: string) => {
      return await fetch({
        method: RequestMethod.GET,
        pathname: `/account/verify?id=${id}&token=${token}`,
      });
    },
    [fetch],
  );

  return {
    getAccountHeaders,

    login,
    register,
    logout,
    verify,
    recoverPassword,
    changePassword,

    refresh,

    isLogged,

    setAsAdmin,
  };
};
