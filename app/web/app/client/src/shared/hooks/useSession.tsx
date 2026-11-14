import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useApi, useCookies } from "shared/hooks";
import { Account } from "shared/types";

type SessionState = {
  // getHeaders: () => Record<string, string>;
  account: Account | null | undefined;
  login: () => Promise<void>;
  logout: () => void;
};

const SessionContext = React.createContext<SessionState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const SessionProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const { get, set, remove } = useCookies();
  const { fetch } = useApi();

  const [account, setAccount] = useState<Account | null | undefined>(undefined);
  const redirectRef = useRef<string>(null);

  const params = new URLSearchParams(window.location.search);
  // const $state = params.get("state");
  const $token = params.get("token");

  const makeRequest = useCallback(async () => {
    if (redirectRef.current) return;

    const { status, data } = await fetch({
      pathname: "auth/request",
      preventReload: true,
    });

    switch (status) {
      // auth disabled
      case 410:
        setAccount(null);
        break;
      case 200:
        setAccount(null);
        redirectRef.current = data.redirectUrl;
        break;
    }
  }, []);

  useEffect(() => {
    const token = $token ?? get("connection-token");
    if (token) set("connection-token", token, 1);

    if (window.location.search)
      window.history.replaceState("", document.title, window.location.pathname);

    (async () => {
      if (token) {
        try {
          const { status, data } = await fetch({
            pathname: "auth/user",
            headers: {
              token,
            },
            preventReload: true,
          });
          setAccount(data);
          return;
        } catch (e) {
          remove("connection-token");
        }
      }

      await makeRequest();
    })();
  }, []);

  const login = useCallback(async () => {
    await makeRequest();
    window.location.replace(redirectRef.current);
  }, [fetch]);

  const logout = useCallback(async () => {
    if (!account) return;

    remove("connection-token");
    setAccount(null);
  }, [account, fetch]);

  return (
    <SessionContext.Provider
      value={{
        account,
        login,
        logout,
      }}
      children={children}
    />
  );
};

export const useSession = (): SessionState => useContext(SessionContext);
