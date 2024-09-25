import { useApi } from "./useApi";

export const useAccount = () => {
  const { refreshSession, getSessionId, getToken } = useApi();

  const $getHeaders = () => {
    const headers = new Headers();
    headers.append("sessionId", getSessionId());
    headers.append("token", getToken());

    return headers;
  };

  const getAccount = async () => {
    const { data } = await fetch(`/api/v2/account`, {
      headers: $getHeaders(),
    }).then((response) => response.json());
    return data;
  };

  const getOTP = async (): Promise<string> => {
    const { data } = await fetch(`/api/v2/account/otp`, {
      headers: $getHeaders(),
      method: "POST",
    }).then((response) => response.json());

    return data?.uri;
  };

  const verifyOTP = async (token: string): Promise<boolean> => {
    const { status } = await fetch(
      `/api/v2/account/otp/verify?token=${token}`,
      {
        headers: $getHeaders(),
      },
    ).then((response) => response.json());

    return status === 200;
  };

  const deleteOTP = async () => {
    await fetch(`/api/v2/account/otp`, {
      headers: $getHeaders(),
      method: "DELETE",
    }).then((response) => response.json());
  };

  return {
    getAccount,

    getOTP,
    verifyOTP,
    deleteOTP,
  };
};
