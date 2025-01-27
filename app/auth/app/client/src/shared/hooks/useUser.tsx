import React, { ReactNode, useCallback, useContext, useState } from "react";
import { User } from "shared/types";
import { useApi } from "shared/hooks/useApi";
import { useAccount } from "shared/hooks/useAccount";
import { RequestMethod } from "shared/enums";
import { useNavigate } from "react-router-dom";

type UserState = {
  user: User | null;

  getLicense: () => Promise<string>;
  refresh: () => Promise<void>;

  update: (data: { languages: string[] }) => void;

  clear: () => void;
};

const UserContext = React.createContext<UserState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const UserProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();
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

  const refresh = useCallback(
    () =>
      fetchUser()
        .then(setUser)
        .catch(() => navigate("/login")),
    [fetchUser, setUser, navigate],
  );

  const update = useCallback(
    (body: { languages: string[] }) =>
      fetch({
        method: RequestMethod.PATCH,
        pathname: "/user/@me",
        headers: getAccountHeaders(),
        body,
      })
        .then(refresh)
        .catch(() => navigate("/login")),
    [fetchUser, navigate, getAccountHeaders],
  );

  const clear = useCallback(() => {
    setUser(null);
  }, [setUser]);

  return (
    <UserContext.Provider
      value={{
        user,
        getLicense,

        refresh,

        update,

        clear,
      }}
      children={children}
    />
  );
};

export const useUser = (): UserState => useContext(UserContext);
