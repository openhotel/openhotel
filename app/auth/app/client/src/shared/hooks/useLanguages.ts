import { useApi } from "./useApi";
import { useCallback, useState } from "react";
import { RequestMethod } from "@shared/enums/request.enums.ts";

export const useLanguages = () => {
  const { fetch } = useApi();

  const [languages, setLanguages] = useState<string[]>([]);

  const fetchLanguages = useCallback(async () => {
    const { data } = await fetch({
      method: RequestMethod.GET,
      pathname: `/data/languages`,
    });
    setLanguages(data.languages);
  }, [fetch, setLanguages]);

  return {
    languages,
    fetchLanguages,
  };
};
