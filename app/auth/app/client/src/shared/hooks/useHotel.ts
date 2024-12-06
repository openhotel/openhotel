import { useApi } from "./useApi";
import { useCallback } from "react";
import { RequestMethod } from "shared/enums";
import { useAccount } from "./useAccount";

export const useHotel = () => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const get = useCallback(
    async (hotelId: string, integrationId: string) => {
      const { data } = await fetch({
        method: RequestMethod.GET,
        pathname: `/hotel?hotelId=${hotelId}&integrationId=${integrationId}`,
        headers: getAccountHeaders(),
      });

      return data;
    },
    [fetch, getAccountHeaders],
  );

  return {
    get,
  };
};
