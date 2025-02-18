import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApi } from "shared/hooks/useApi";
import { useCookies } from "shared/hooks/useCookies";
import {
  AccountChangePassProps,
  AccountLoginProps,
  AccountRecoverPassProps,
  AccountRegisterProps,
  AccountSession,
} from "shared/types";
import { RequestMethod } from "shared/enums";

type AccountState = {
  getAccountHeaders: () => Record<string, string>;
  getTokenId: () => string;

  login: (body: AccountLoginProps) => Promise<void>;
  register: (body: AccountRegisterProps) => Promise<void>;
  logout: () => Promise<void>;
  verify: (id: string, token: string) => Promise<void>;
  recoverPassword: (body: AccountRecoverPassProps) => Promise<void>;
  changePassword: (body: AccountChangePassProps) => Promise<void>;

  getTokens: () => Promise<AccountSession[]>;
  removeToken: (tokenId: string) => Promise<void>;

  refresh: () => Promise<void>;

  isLogged: boolean;

  setAsAdmin: () => Promise<void>;

  __deleteAccount: () => Promise<void>;
};

const AccountContext = React.createContext<AccountState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const AccountProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const { fetch } = useApi();
  const { set: setCookie, get: getCookie, remove: removeCookie } = useCookies();

  const [isLogged, setIsLogged] = useState<boolean>(null);

  const getAccountHeaders = useCallback(
    () => ({
      "account-id": getCookie("account-id"),
      token: getCookie("token"),
    }),
    [getCookie],
  );

  const getTokenId = useCallback(
    () => (isLogged ? getCookie("token").substring(0, 4) : null),
    [getCookie, isLogged],
  );

  const clearSession = useCallback(() => {
    removeCookie("account-id");
    removeCookie("refresh-token");
    removeCookie("token");
  }, [removeCookie]);

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
        cache: false,
      });

      setCookie("account-id", accountId, refreshTokenDuration);
      setCookie("refresh-token", refreshToken, refreshTokenDuration);
      setCookie("token", token, tokenDuration);

      setIsLogged(true);
    },
    [fetch, setCookie, setIsLogged],
  );

  const register = useCallback(
    async (body: AccountRegisterProps) =>
      fetch({
        method: RequestMethod.POST,
        pathname: "/account/register",
        body,
        cache: false,
      }),
    [fetch],
  );

  const logout = useCallback(async () => {
    fetch({
      method: RequestMethod.POST,
      pathname: "/account/logout",
      headers: getAccountHeaders(),
      cache: false,
    });

    clearSession();
    setIsLogged(false);
  }, [fetch, getAccountHeaders, clearSession]);

  const recoverPassword = useCallback(
    async (body: AccountRecoverPassProps) =>
      fetch({
        method: RequestMethod.POST,
        pathname: "/account/recover-password",
        body,
        cache: false,
      }),
    [fetch],
  );

  const changePassword = useCallback(
    async (body: AccountChangePassProps) =>
      fetch({
        method: RequestMethod.POST,
        pathname: "/account/change-password",
        body,
        cache: false,
      }),
    [fetch],
  );

  const getTokens = useCallback(async () => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: `/account/token`,
      headers: getAccountHeaders(),
      cache: false,
    });

    return data.tokens;
  }, [fetch, getAccountHeaders]);

  const removeToken = useCallback(
    async (tokenId: string) => {
      return await fetch({
        method: RequestMethod.DELETE,
        pathname: `/account/token?tokenId=${tokenId}`,
        headers: getAccountHeaders(),
        cache: false,
      });
    },
    [fetch, getAccountHeaders],
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
      cache: false,
    });
    if (!data) return;

    token = data.token;
    refreshToken = data.refreshToken;
    const [tokenDuration, refreshTokenDuration] = data.durations;

    setCookie("account-id", accountId, refreshTokenDuration);
    setCookie("refresh-token", refreshToken, refreshTokenDuration);
    setCookie("token", token, tokenDuration);
  }, [fetch, setCookie, getCookie]);

  const setAsAdmin = useCallback(() => {
    return fetch({
      method: RequestMethod.POST,
      pathname: "/admin",
      headers: getAccountHeaders(),
      cache: false,
    });
  }, [fetch, getAccountHeaders]);

  const verify = useCallback(
    async (id: string, token: string) => {
      return await fetch({
        method: RequestMethod.GET,
        pathname: `/account/verify?id=${id}&token=${token}`,
        cache: false,
      });
    },
    [fetch],
  );

  const __deleteAccount = useCallback(async () => {
    await fetch({
      method: RequestMethod.DELETE,
      pathname: `/account`,
      headers: getAccountHeaders(),
    });

    clearSession();

    setIsLogged(false);
  }, [fetch, getAccountHeaders, setIsLogged, clearSession]);

  useEffect(() => {
    if (isLogged !== null) return;

    refresh()
      .then(() => setIsLogged(true))
      .catch(() => {
        clearSession();
        setIsLogged(false);
      });
  }, [isLogged]);

  return (
    <AccountContext.Provider
      value={{
        getAccountHeaders,
        getTokenId,

        login,
        register,
        logout,
        verify,
        recoverPassword,
        changePassword,

        getTokens,
        removeToken,

        refresh,

        isLogged,

        setAsAdmin,

        __deleteAccount,
      }}
      children={children}
    />
  );
};

export const useAccount = (): AccountState => useContext(AccountContext);
