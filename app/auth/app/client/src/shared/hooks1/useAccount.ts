import { useApi } from "./useApi";

export const useAccount = () => {
  const { getSessionId, getToken } = useApi();

  const getHeaders = () => {
    const headers = new Headers();
    headers.append("sessionId", getSessionId());
    headers.append("token", getToken());

    return headers;
  };

  const getAccount = async () => {
    const { data } = await fetch(`/api/v2/account`, {
      headers: getHeaders(),
    }).then((response) => response.json());
    return data;
  };

  const otp = () => {
    const get = async (): Promise<string> => {
      const { data } = await fetch(`/api/v2/account/otp`, {
        headers: getHeaders(),
        method: "POST",
      }).then((response) => response.json());

      return data?.uri;
    };

    const verify = async (token: string): Promise<boolean> => {
      const { status } = await fetch(
        `/api/v2/account/otp/verify?token=${token}`,
        {
          headers: getHeaders(),
        },
      ).then((response) => response.json());

      return status === 200;
    };

    const remove = async () => {
      await fetch(`/api/v2/account/otp`, {
        headers: getHeaders(),
        method: "DELETE",
      }).then((response) => response.json());
    };

    return {
      get,
      verify,
      remove,
    };
  };

  const at = () => {
    const create = async (did: string) => {
      return await fetch(`/api/v2/at/create`, {
        headers: getHeaders(),
        method: "POST",
        body: JSON.stringify({
          did,
        }),
      }).then((response) => response.json());
    };

    return {
      create,
    };
  };

  return {
    getAccount,
    getHeaders,

    otp: otp(),
    at: at(),
  };
};
