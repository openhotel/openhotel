import { useApi } from "./useApi";
import { useCallback } from "react";
import { useAccount } from "./useAccount";
import { RequestMethod } from "@shared/enums/request.enums.ts";

export const useHotels = () => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const getList = useCallback(async () => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: `/hotel/list`,
      headers: getAccountHeaders(),
    });

    return data.hotels;
  }, [fetch, getAccountHeaders]);

  return {
    getList,
  };
};
