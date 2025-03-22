import { useApi } from "./useApi";
import { useCallback } from "react";
import { RequestMethod } from "shared/enums";
import { useAccount } from "./useAccount";

export const useMyHotels = () => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const get = useCallback(async () => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: `/user/@me/hotel`,
      headers: getAccountHeaders(),
    });

    return data.hotels;
  }, [fetch, getAccountHeaders]);

  const create = useCallback(
    async (name: string) => {
      const { data } = await fetch({
        method: RequestMethod.POST,
        pathname: `/user/@me/hotel`,
        headers: getAccountHeaders(),
        body: {
          name,
        },
      });

      return data.hotels;
    },
    [fetch, getAccountHeaders],
  );

  const update = useCallback(
    async (hotelId: string, name: string, $public: boolean) => {
      await fetch({
        method: RequestMethod.PATCH,
        pathname: `/user/@me/hotel`,
        headers: getAccountHeaders(),
        body: {
          hotelId,
          name,
          public: $public,
        },
      });
    },
    [fetch, getAccountHeaders],
  );

  const remove = useCallback(
    async (hotelId: string) => {
      await fetch({
        method: RequestMethod.DELETE,
        pathname: `/user/@me/hotel?hotelId=${hotelId}`,
        headers: getAccountHeaders(),
      });
    },
    [fetch, getAccountHeaders],
  );

  const integrations = (() => {
    const generate = useCallback(
      async (hotelId: string, integrationId: string) => {
        const { data } = await fetch({
          method: RequestMethod.GET,
          pathname: `/user/@me/hotel/integration?hotelId=${hotelId}&integrationId=${integrationId}`,
          headers: getAccountHeaders(),
        });

        return data.token;
      },
      [fetch, getAccountHeaders],
    );

    const remove = useCallback(
      async (hotelId: string, integrationId: string) => {
        await fetch({
          method: RequestMethod.DELETE,
          pathname: `/user/@me/hotel/integration?hotelId=${hotelId}&integrationId=${integrationId}`,
          headers: getAccountHeaders(),
        });
      },
      [fetch, getAccountHeaders],
    );
    const create = useCallback(
      async (
        hotelId: string,
        name: string,
        redirectUrl: string,
        type: string,
      ) => {
        await fetch({
          method: RequestMethod.POST,
          pathname: `/user/@me/hotel/integration`,
          headers: getAccountHeaders(),
          body: {
            hotelId,
            name,
            redirectUrl,
            type,
          },
        });
      },
      [fetch, getAccountHeaders],
    );

    return {
      create,
      generate,
      remove,
    };
  })();

  return {
    get,
    create,
    update,
    remove,

    integrations,
  };
};
