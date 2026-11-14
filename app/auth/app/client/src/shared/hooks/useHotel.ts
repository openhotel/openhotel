import { useApi } from "./useApi";
import { useCallback } from "react";
import { RequestMethod } from "shared/enums";
import { useAccount } from "./useAccount";

export const useHotel = () => {
  const { fetch: $fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const get = useCallback(
    async (hotelId: string, integrationId: string) => {
      const { data } = await $fetch({
        method: RequestMethod.GET,
        pathname: `/hotel?hotelId=${hotelId}&integrationId=${integrationId}`,
        headers: getAccountHeaders(),
      });

      return data;
    },
    [$fetch, getAccountHeaders],
  );

  const getHotelUrl = useCallback((clientUrl: string, pathname: string) => {
    const pingUrl = new URL(clientUrl);
    pingUrl.pathname = pathname;
    return pingUrl.href;
  }, []);

  const getHotelInfo = useCallback(
    (clientUrl: string) => {
      return new Promise((resolve) => {
        let initialTime = performance.now();
        let ping = 0;
        fetch(getHotelUrl(clientUrl, "info"))
          .then((response) => {
            ping = performance.now() - initialTime;
            return response.json();
          })
          .then(({ status, data }) => {
            if (status !== 200) return resolve(null);

            resolve({ ping, data });
          })
          .catch(() => {
            resolve(null);
          });
      });
    },
    [getHotelUrl],
  );

  return {
    get,
    getHotelInfo,
    getHotelUrl,
  };
};
