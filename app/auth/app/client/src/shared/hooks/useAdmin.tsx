import React, { ReactNode, useCallback, useContext, useState } from "react";
import { useApi } from "shared/hooks/useApi";
import { useAccount } from "shared/hooks/useAccount";
import { Backup, DbHotel, AppToken, Token, User } from "shared/types";
import { RequestMethod } from "shared/enums";

type AdminState = {
  users: User[];
  fetchUsers: () => Promise<void>;

  hotels: DbHotel[];
  fetchHotels: () => Promise<void>;
  updateHotel: (
    hotelId: string,
    body: { blocked?: boolean; verified?: boolean; official?: boolean },
  ) => Promise<void>;
  deleteHotelIntegration: (
    hotelId: string,
    integrationId: string,
  ) => Promise<void>;
  deleteHotel: (hotelId: string) => Promise<void>;

  tokens: Token[];
  fetchTokens: () => Promise<void>;
  addToken: (label: string) => Promise<string>;
  removeToken: (id: string) => Promise<void>;

  apps: AppToken[];
  fetchApps: () => Promise<void>;
  addApp: (url: string) => Promise<string>;
  removeApps: (id: string) => Promise<void>;

  update: () => Promise<void>;

  updateUser: (user: User) => Promise<void>;
  deleteUser: (user: User) => Promise<void>;
  resendVerificationUser: (accountId: string) => Promise<void>;

  backups: Backup[];
  fetchBackups: () => Promise<void>;
  backup: (name: string) => Promise<void>;
  deleteBackup: (name: string) => Promise<void>;
  downloadBackup: (name: string) => Promise<void>;
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
  const [apps, setApps] = useState<AppToken[]>([]);
  const [hotels, setHotels] = useState<DbHotel[]>([]);
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
        pathname: `/admin/apps?id=${id}`,
        headers: getAccountHeaders(),
      });
      setApps((tokens) => tokens.filter((token) => token.id !== id));
    },
    [fetch, getAccountHeaders, setApps],
  );

  const fetchApps = useCallback(async () => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/apps",
      headers: getAccountHeaders(),
    }).then((response) => setApps(response.data.tokens));
  }, [fetch, getAccountHeaders]);

  const addApp = useCallback(
    async (url: string): Promise<string> => {
      const { id, token } = (
        await fetch({
          method: RequestMethod.POST,
          pathname: "/admin/apps",
          headers: getAccountHeaders(),
          body: {
            url,
          },
        })
      ).data;
      setApps((tokens) => [
        ...tokens,
        {
          id,
          url,
        },
      ]);
      return token;
    },
    [fetch, getAccountHeaders, setApps],
  );

  const removeApps = useCallback(
    async (id: string): Promise<void> => {
      await fetch({
        method: RequestMethod.DELETE,
        pathname: `/admin/apps?id=${id}`,
        headers: getAccountHeaders(),
      });
      setApps((tokens) => tokens.filter((token) => token.id !== id));
    },
    [fetch, getAccountHeaders, setTokens],
  );

  const fetchHotels = useCallback(async () => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/hotel",
      headers: getAccountHeaders(),
    }).then((response) =>
      setHotels(
        response.data.hotels.sort(
          (a: DbHotel, b: DbHotel) => b.accounts.length - a.accounts.length,
        ),
      ),
    );
  }, [fetch, getAccountHeaders]);

  const deleteHotel = useCallback(
    async (hotelId: string) => {
      return fetch({
        method: RequestMethod.DELETE,
        pathname: `/admin/hotel?hotelId=${hotelId}`,
        headers: getAccountHeaders(),
      });
    },
    [fetch, getAccountHeaders],
  );

  const updateHotel = useCallback(
    async (
      hotelId: string,
      body: { blocked?: boolean; verified?: boolean; official?: boolean },
    ) => {
      return fetch({
        method: RequestMethod.PATCH,
        pathname: `/admin/hotel`,
        headers: getAccountHeaders(),
        body: {
          hotelId,
          ...body,
        },
      });
    },
    [fetch, getAccountHeaders],
  );

  const deleteHotelIntegration = useCallback(
    async (hotelId: string, integrationId: string) => {
      return fetch({
        method: RequestMethod.DELETE,
        pathname: `/admin/hotel/integration?hotelId=${hotelId}&integrationId=${integrationId}`,
        headers: getAccountHeaders(),
      });
    },
    [fetch, getAccountHeaders],
  );

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
    }).then((response) =>
      setBackups(
        response.data.backups.map((data) => ({
          ...data,
          id: data.name.substring(0, 26),
        })),
      ),
    );
  }, [fetch, getAccountHeaders, setBackups]);

  const backup = useCallback(async (name: string) => {
    await fetch({
      method: RequestMethod.POST,
      pathname: "/admin/backup",
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
      pathname: "/admin/backup",
      headers: getAccountHeaders(),
      body: {
        name,
      },
    });
    await fetchBackups();
  }, []);

  const downloadBackup = useCallback(async (name: string) => {
    const response = await fetch({
      method: RequestMethod.GET,
      pathname: `/admin/backup?name=${name}`,
      headers: getAccountHeaders(),
      rawResponse: true,
    });

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, []);

  return (
    <AdminContext.Provider
      value={{
        users,
        fetchUsers,

        updateUser,
        deleteUser,
        resendVerificationUser,

        hotels,
        fetchHotels,
        updateHotel,
        deleteHotelIntegration,
        deleteHotel,

        tokens,
        fetchTokens,
        addToken,
        removeToken,

        apps,
        fetchApps,
        addApp,
        removeApps,

        update,

        fetchBackups,
        backups,
        backup,
        deleteBackup,
        downloadBackup,
      }}
      children={children}
    />
  );
};

export const useAdmin = (): AdminState => useContext(AdminContext);
