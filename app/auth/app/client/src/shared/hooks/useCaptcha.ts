import { useApi } from "./useApi";
import { useCallback } from "react";
import { RequestMethod } from "shared/enums";
import { useAccount } from "./useAccount";

export const useCaptcha = () => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const get = useCallback(
    () =>
      fetch({
        method: RequestMethod.GET,
        headers: getAccountHeaders(),
        pathname: "/_/captcha",
      }),
    [fetch, getAccountHeaders],
  );

  return {
    get,
  };
};
