import React, { ReactNode, useCallback, useContext, useState } from "react";
import { useApi } from "shared/hooks/useApi";
import { useAccount } from "shared/hooks/useAccount";
import { Backup, DbHotel, ThirdPartyToken, Token, User } from "shared/types";
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

  backups: Backup[];
  fetchBackups: () => Promise<void>;

  tokens: Token[];
  fetchTokens: () => Promise<void>;
  addToken: (label: string) => Promise<string>;
  removeToken: (id: string) => Promise<void>;

  thirdParty: ThirdPartyToken[];
  fetchThirdParty: () => Promise<void>;
  addThirdParty: (url: string) => Promise<string>;
  removeThirdParty: (id: string) => Promise<void>;

  update: () => Promise<void>;

  updateUser: (user: User) => Promise<void>;
  deleteUser: (user: User) => Promise<void>;
  resendVerificationUser: (accountId: string) => Promise<void>;

  backup: (name: string) => Promise<void>;
  deleteBackup: (name: string) => Promise<void>;
  syncBackups: () => Promise<void>;
  sync: boolean | null;
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
  const [thirdParty, setThirdParty] = useState<ThirdPartyToken[]>([]);
  const [hotels, setHotels] = useState<DbHotel[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [sync, setSync] = useState<boolean | null>(false);

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
        pathname: `/admin/third-party?id=${id}`,
        headers: getAccountHeaders(),
      });
      setThirdParty((tokens) => tokens.filter((token) => token.id !== id));
    },
    [fetch, getAccountHeaders, setThirdParty],
  );

  const fetchThirdParty = useCallback(async () => {
    return fetch({
      method: RequestMethod.GET,
      pathname: "/admin/third-party",
      headers: getAccountHeaders(),
    }).then((response) => setThirdParty(response.data.tokens));
  }, [fetch, getAccountHeaders]);

  const addThirdParty = useCallback(
    async (url: string): Promise<string> => {
      const { id, token } = (
        await fetch({
          method: RequestMethod.POST,
          pathname: "/admin/third-party",
          headers: getAccountHeaders(),
          body: {
            url,
          },
        })
      ).data;
      setThirdParty((tokens) => [
        ...tokens,
        {
          id,
          url,
        },
      ]);
      return token;
    },
    [fetch, getAccountHeaders, setThirdParty],
  );

  const removeThirdParty = useCallback(
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
      pathname: "/admin/hotel",
      headers: getAccountHeaders(),
    }).then((response) => setHotels(response.data.hotels));
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

  const syncBackups = useCallback(async () => {
    setSync(true);
    await fetch({
      method: RequestMethod.GET,
      pathname: "/admin/backups/sync",
      headers: getAccountHeaders(),
    })
      .then(() => setSync(false))
      .catch(() => setSync(null));
  }, [setSync]);

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

        thirdParty,
        fetchThirdParty,
        addThirdParty,
        removeThirdParty,

        update,

        fetchBackups,
        backups,
        backup,
        deleteBackup,
        syncBackups,
        sync,
      }}
      children={children}
    />
  );
};

export const useAdmin = (): AdminState => useContext(AdminContext);
