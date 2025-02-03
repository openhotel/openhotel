import React, { ReactNode, useCallback, useContext, useState } from "react";
import { useApi } from "shared/hooks/useApi";
import { useAccount } from "shared/hooks/useAccount";
import { Backup, PrivateHotel, Token, User } from "shared/types";
import { RequestMethod } from "shared/enums";

type AdminState = {
  users: User[];
  fetchUsers: () => Promise<void>;

  tokens: Token[];
  fetchTokens: () => Promise<void>;

  hotels: PrivateHotel[];
  fetchHotels: () => Promise<void>;

  backups: Backup[];
  fetchBackups: () => Promise<void>;

  addToken: (label: string) => Promise<string>;
  removeToken: (id: string) => Promise<void>;

  update: () => Promise<void>;

  updateUser: (user: User) => Promise<void>;
  deleteUser: (user: User) => Promise<void>;
  resendVerificationUser: (accountId: string) => Promise<void>;

  backup: (name: string) => Promise<void>;
  deleteBackup: (name: string) => Promise<void>;
};

const AdminContext = React.createContext<AdminState>(undefined);

type ProviderProps = {
  children: ReactNode;
};

export const AdminProvider: React.FunctionComponent<ProviderProps> = ({
  children,
}) => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const [users, setUsers] = useState<User[]>([]);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [hotels, setHotels] = useState<PrivateHotel[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);

  const fetchUsers = useCallback(async () => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/users",
      headers: getAccountHeaders(),
    }).then((response) => setUsers(response.data.users));
  }, [fetch, getAccountHeaders]);

  const updateUser = useCallback(
    (user: User) => {
      return fetch({
        method: RequestMethod.PATCH,
        pathname: "/admin/user",
        headers: getAccountHeaders(),
        body: user,
      });
    },
    [fetch, getAccountHeaders],
  );

  const deleteUser = useCallback(
    (user: User) => {
      return fetch({
        method: RequestMethod.DELETE,
        pathname: "/admin/user",
        headers: getAccountHeaders(),
        body: user,
      });
    },
    [fetch, getAccountHeaders],
  );

  const resendVerificationUser = useCallback(
    (accountId: string) => {
      return fetch({
        method: RequestMethod.POST,
        pathname: "/admin/user/resendVerification",
        headers: getAccountHeaders(),
        body: { accountId },
      });
    },
    [fetch, getAccountHeaders],
  );

  const fetchTokens = useCallback(async () => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/tokens",
      headers: getAccountHeaders(),
    }).then((response) => setTokens(response.data.tokens));
  }, [fetch, getAccountHeaders]);

  const addToken = useCallback(
    async (label: string): Promise<string> => {
      const { id, token } = (
        await fetch({
          method: RequestMethod.POST,
          pathname: "/admin/tokens",
          headers: getAccountHeaders(),
          body: {
            label,
          },
        })
      ).data;
      setTokens((tokens) => [
        ...tokens,
        {
          id,
          label,
        },
      ]);
      return token;
    },
    [fetch, getAccountHeaders, setTokens],
  );

  const removeToken = useCallback(
    async (id: string): Promise<void> => {
      await fetch({
        method: RequestMethod.DELETE,
        pathname: `/admin/tokens?id=${id}`,
        headers: getAccountHeaders(),
      });
      setTokens((tokens) => tokens.filter((token) => token.id !== id));
    },
    [fetch, getAccountHeaders, setTokens],
  );

  const fetchHotels = useCallback(async () => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/hotels",
      headers: getAccountHeaders(),
    }).then((response) => setHotels(response.data.hotels));
  }, [fetch, getAccountHeaders]);

  const update = useCallback(() => {
    return fetch({
      method: RequestMethod.PATCH,
      pathname: "/admin/update",
      headers: getAccountHeaders(),
    });
  }, [fetch, getAccountHeaders]);

  const fetchBackups = useCallback(() => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/backups",
      headers: getAccountHeaders(),
    }).then((response) => setBackups(response.data.backups));
  }, [fetch, getAccountHeaders, setBackups]);

  const backup = useCallback(async (name: string) => {
    await fetch({
      method: RequestMethod.POST,
      pathname: "/admin/backups",
      headers: getAccountHeaders(),
      body: {
        name,
      },
    });
    await fetchBackups();
  }, []);

  const deleteBackup = useCallback(async (name: string) => {
    await fetch({
      method: RequestMethod.DELETE,
      pathname: "/admin/backups",
      headers: getAccountHeaders(),
      body: {
        name,
      },
    });
    await fetchBackups();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        fetchUsers,

        updateUser,
        deleteUser,
        resendVerificationUser,

        tokens,
        fetchTokens,

        hotels,
        fetchHotels,

        addToken,
        removeToken,
        update,

        fetchBackups,
        backups,
        backup,
        deleteBackup,
      }}
      children={children}
    />
  );
};

export const useAdmin = (): AdminState => useContext(AdminContext);
