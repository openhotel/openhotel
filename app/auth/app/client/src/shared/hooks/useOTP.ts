import { useApi } from "./useApi";
import { useCallback } from "react";
import { RequestMethod } from "shared/enums";
import { useAccount } from "./useAccount";

export const useOTP = () => {
  const { fetch } = useApi();
  const { getAccountHeaders } = useAccount();

  const get = useCallback(
    () =>
      fetch({
        method: RequestMethod.GET,
        headers: getAccountHeaders(),
        pathname: "/account/otp",
      }),
    [fetch, getAccountHeaders],
  );

  const remove = useCallback(
    () =>
      fetch({
        method: RequestMethod.DELETE,
        headers: getAccountHeaders(),
        pathname: "/account/otp",
      }),
    [fetch, getAccountHeaders],
  );

  const verify = useCallback(
    (token: string) =>
      fetch({
        method: RequestMethod.GET,
        headers: getAccountHeaders(),
        pathname: `/account/otp/verify?token=${token}`,
      }),
    [fetch, getAccountHeaders],
  );

  return {
    get,
    remove,
    verify,
  };
};
