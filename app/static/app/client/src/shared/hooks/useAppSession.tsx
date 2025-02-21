import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useApi, useCookies } from "shared/hooks";

type User = {
  accountId: string;
  admin: boolean;
  languages: string[];
  username: string;
};

type AppSessionState = {
  getHeaders: () => Record<string, string>;
  user?: User;
};

const AppSessionContext = React.createContext<AppSessionState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const AppSessionProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const { get, set } = useCookies();
  const { fetch } = useApi();

  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<User | undefined>(undefined);

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

    if (window.location.hash) {
      window.history.replaceState("", document.title, window.location.pathname);
    }

    (async () => {
      const {
        data: { enabled },
      } = await fetch({
        pathname: "auth",
      });

      if (!enabled) return;

      if (accountId && accountToken) {
        const { status, data } = await fetch({
          pathname: `auth/user`,
          headers: getHeaders(),
        });

        if (status === 200) {
          set("account-id", accountId, 1);
          set("account-token", accountToken, 1);
          setIsLogged(true);
          setUser(data);
          return;
        }
      }
      const { data } = await fetch({
        pathname: "auth/redirect",
      });
      window.location.href = data.url;
    })();
  }, [setIsLogged, setUser]);

  return (
    <AppSessionContext.Provider
      value={{
        getHeaders,
        user,
      }}
      children={isLogged ? children : null}
    />
  );
};

export const useAppSession = (): AppSessionState =>
  useContext(AppSessionContext);
