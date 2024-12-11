import { useApi } from "./useApi";
import { RequestMethod } from "shared/enums";
import {
  AccountChangePassProps,
  AccountLoginProps,
  AccountRecoverPassProps,
  AccountRegisterProps,
} from "shared/types";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const useAccount = () => {
  const { fetch } = useApi();

  const [isLogged, setIsLogged] = useState<boolean>(null);

  useEffect(() => {
    refresh()
      .then(() => setIsLogged(true))
      .catch(() => setIsLogged(false));
  }, []);

  const getAccountHeaders = useCallback(
    () => ({
      "account-id": Cookies.get("account-id"),
      token: Cookies.get("token"),
    }),
    [],
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

      Cookies.set("account-id", accountId, {
        expires: refreshTokenDuration,
        sameSite: "strict",
        secure: true,
      });
      Cookies.set("refresh-token", refreshToken, {
        expires: refreshTokenDuration,
        sameSite: "strict",
        secure: true,
      });
      Cookies.set("token", token, {
        expires: tokenDuration,
        sameSite: "strict",
        secure: true,
      });
    },
    [fetch],
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

    Cookies.remove("account-id");
    Cookies.remove("refresh-token");
    Cookies.remove("token");
  }, [fetch, getAccountHeaders]);

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
    let accountId = Cookies.get("account-id");
    let token = Cookies.get("token");
    let refreshToken = Cookies.get("refresh-token");

    if (!accountId || (!token && !refreshToken)) throw "Not logged";

    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: "/account/refresh",
      headers: {
        "account-id": Cookies.get("account-id"),
        token: Cookies.get("token"),
        "refresh-token": Cookies.get("refresh-token"),
      },
    });
    if (!data) return;

    token = data.token;
    refreshToken = data.refreshToken;
    const [tokenDuration, refreshTokenDuration] = data.durations;

    Cookies.set("account-id", accountId, {
      expires: refreshTokenDuration,
      sameSite: "strict",
      secure: true,
    });
    Cookies.set("refresh-token", refreshToken, {
      expires: refreshTokenDuration,
      sameSite: "strict",
      secure: true,
    });
    Cookies.set("token", token, {
      expires: tokenDuration,
      sameSite: "strict",
      secure: true,
    });
  }, [fetch]);

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
