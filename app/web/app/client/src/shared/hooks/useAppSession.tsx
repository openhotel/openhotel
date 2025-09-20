import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApi, useCookies } from "shared/hooks";
import { Account } from "shared/types";
import { ulid } from "ulidx";

type AppSessionState = {
  getHeaders: () => Record<string, string>;
  account: Account | null | undefined;
  login: () => Promise<void>;
  logout: () => void;
};

const AppSessionContext = React.createContext<AppSessionState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const AppSessionProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const { get, set, remove } = useCookies();
  const { fetch } = useApi();

  const [account, setAccount] = useState<Account>(undefined);

  const params = new URLSearchParams(window.location.hash.replace("#", "?"));
  const $accountId = params.get("accountId");
  const $accountToken = params.get("accountToken");

  const getHeaders = useCallback(
    () => ({
      "account-id": $accountId ?? get("account-id"),
      "account-token": $accountToken ?? get("account-token"),
    }),
    [$accountId, $accountToken, get],
  );

  useEffect(() => {
    const accountId = $accountId ?? get("account-id");
    const accountToken = $accountToken ?? get("account-token");

    if (window.location.hash)
      window.history.replaceState("", document.title, window.location.pathname);

    (async () => {
      const {
        data: { enabled },
      } = await fetch({
        pathname: "auth",
      });

      if (!enabled) {
        setAccount({
          accountId: ulid(),
          username: "development",
          admin: true,
          languages: ["en"],
        });
        return;
      }

      if (accountId && accountToken) {
        try {
          const { status, data } = await fetch({
            pathname: `auth/user`,
            headers: getHeaders(),
            preventReload: true,
          });

          if (status === 200) {
            set("account-id", accountId, 1);
            set("account-token", accountToken, 1);
            setAccount(data);
            return;
          }
        } catch (e) {
          remove("account-id");
          remove("account-token");
        }
      }

      setAccount(null);
    })();
  }, [fetch, getHeaders, setAccount, remove, set, ulid]);

  const login = useCallback(async () => {
    if (account) return;

    const { data } = await fetch({
      pathname: "auth/redirect",
    });
    window.location.replace(data.url);
  }, []);

  const logout = useCallback(() => {
    console.log(account);
    if (!account) return;

    remove("account-id");
    remove("account-token");
    setAccount(null);
  }, [remove, setAccount, account]);

  return (
    <AppSessionContext.Provider
      value={{
        getHeaders,
        account,
        login,
        logout,
      }}
      children={children}
    />
  );
};

export const useAppSession = (): AppSessionState =>
  useContext(AppSessionContext);
