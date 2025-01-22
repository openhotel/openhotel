import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "shared/types";
import { useApi } from "shared/hooks/useApi";
import { useAccount } from "shared/hooks/useAccount";
import { RequestMethod } from "shared/enums";
import { useNavigate } from "react-router-dom";

type UserState = {
  user: User | null;

  getLicense: () => Promise<string>;
  initUser: () => Promise<void>;
};

const UserContext = React.createContext<UserState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const UserProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const { fetch } = useApi();
  const { getAccountHeaders, isLogged } = useAccount();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async (): Promise<User> => {
    return (
      await Promise.all([
        fetch({
          method: RequestMethod.GET,
          pathname: "/user/@me",
          headers: getAccountHeaders(),
        }),
        fetch({
          method: RequestMethod.GET,
          pathname: "/user/@me/email",
          headers: getAccountHeaders(),
        }),
      ])
    ).reduce((currentData, { data }) => ({ ...currentData, ...data }), {});
  }, [fetch, getAccountHeaders]);

  const getLicense = useCallback(async () => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: "/user/@me/license",
      headers: getAccountHeaders(),
    });
    return data.licenseToken;
  }, [fetch, getAccountHeaders]);

  const initUser = useCallback(
    () =>
      fetchUser()
        .then(setUser)
        .catch(() => navigate("/login")),
    [fetchUser, setUser, navigate],
  );

  useEffect(() => {
    if (!isLogged || user) return;
    console.log("init");
    initUser();
  }, [user, isLogged, initUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        getLicense,

        initUser,
      }}
      children={children}
    />
  );
};

export const useUser = (): UserState => useContext(UserContext);
