import { useApi } from "./useApi";
import { useCallback } from "react";
import { RequestMethod } from "shared/enums";
import { useAccount } from "./useAccount";
import { Collection, CollectionManifest } from "shared/types";

export const useCollections = () => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const get = useCallback(async (): Promise<Collection[]> => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: `/user/@me/collections`,
      headers: getAccountHeaders(),
    });

    return data.collections;
  }, [fetch, getAccountHeaders]);

  const upload = useCallback(
    async (file: File): Promise<CollectionManifest> => {
      const { data } = await fetch({
        method: RequestMethod.POST,
        pathname: `/user/@me/collections`,
        headers: getAccountHeaders(),
        body: file,
      });

      return data.manifest;
    },
    [fetch, getAccountHeaders],
  );

  return {
    get,
    upload,
  };
};
