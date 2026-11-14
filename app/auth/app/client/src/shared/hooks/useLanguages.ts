import { useApi } from "./useApi";
import { RequestMethod } from "shared/enums";
import { useCallback, useState } from "react";

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
