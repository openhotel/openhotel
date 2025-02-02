import { AccountGithubMutable, DbAccount } from "shared/types/account.types.ts";
import { System } from "modules/system/main.ts";
import { getRandomString } from "@oh/utils";

export const github = (account: DbAccount): AccountGithubMutable => {
  const config = System.getConfig();

  const generateUri = async () => {
    const state = getRandomString(32);

    const redirectUri = `${config.url}/account/github`;

    const expireIn = 60 * 60 * 1000; /* 1h */
    await System.db.set(["githubState", account.accountId], state, {
      expireIn,
    });

    return `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${redirectUri}&state=${state}`;
  };

  const checkState = async (state: string) => {
    const foundState = await System.db.get(["githubState", account.accountId]);
    return foundState === state;
  };

  const link = async (code: string) => {
    const url = new URL("https://github.com/login/oauth/access_token");
    url.searchParams.append("client_id", config.github.clientId);
    url.searchParams.append("client_secret", config.github.clientSecret);
    url.searchParams.append("code", code);

    const tokenResponse = await fetch(url.href, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const { access_token } = await tokenResponse.json();

    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    const { login } = await userResponse.json();

    //prevent linking to more than one account
    if (await System.db.get(["accountsByGithubLogin", login])) return null;

    await System.db.set(["accounts", account.accountId], {
      ...account,
      githubLogin: login,
      updatedAt: Date.now(),
    });
    await System.db.set(["accountsByGithubLogin", login], account.accountId);

    return login;
  };

  const unlink = async () => {
    if (!account.githubLogin) return;

    await System.db.delete(["accountsByGithubLogin", account.githubLogin]);

    delete account.githubLogin;
    await System.db.set(["accounts", account.accountId], {
      ...account,
      updatedAt: Date.now(),
    });
  };

  return {
    generateUri,
    checkState,
    link,
    unlink,
  };
};
