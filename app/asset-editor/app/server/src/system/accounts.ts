import { System } from "system/main.ts";

export const accounts = () => {
  const getData = async (request: Request) => {
    const accountId = request.headers.get("account-id");
    const accountToken = request.headers.get("account-token");

    const {
      auth: { url: authUrl, appToken },
    } = System.getConfig();

    const { status, data } = await fetch(`${authUrl}/api/v3/user/@me`, {
      headers: {
        "app-token": appToken,
        "account-id": accountId,
        "account-token": accountToken,
      },
    }).then((response) => response.json());

    if (status !== 200) return null;

    return data;
  };

  return {
    getData,
  };
};
