import {
  RequestMethod,
  RequestType,
  getResponse,
  getRandomString,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const githubGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/github",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const config = System.getConfig();

    const enabled = url.searchParams.get("enabled");
    if (enabled)
      return getResponse(HttpStatusCode.OK, {
        enabled: config.github.enabled,
      });

    if (!config.github.enabled) return getResponse(HttpStatusCode.IM_A_TEAPOT);

    const account = await System.accounts.getFromRequest(request);
    const state = getRandomString(32);

    const redirectUri = `${config.url}/account/github`;

    const expireIn = 60 * 60 * 1000; /* 1h */
    System.db.set(["githubState", account.accountId], state, { expireIn });

    return getResponse(HttpStatusCode.OK, {
      url: `https://github.com/login/oauth/authorize?client_id=${config.github.clientId}&redirect_uri=${redirectUri}&state=${state}`,
    });
  },
};

export const githubPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/github",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const config = System.getConfig();
    if (!config.github.enabled) return getResponse(HttpStatusCode.IM_A_TEAPOT);

    const { code, state } = await request.json();

    const account = await System.accounts.getFromRequest(request);

    const foundState = await System.db.get(["githubState", account.accountId]);
    if (state !== foundState) return getResponse(HttpStatusCode.FORBIDDEN);

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

    await System.db.set(["github", account.accountId], {
      login,
    });

    return getResponse(HttpStatusCode.OK, {
      login,
    });
  },
};

export const githubDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/github",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const config = System.getConfig();
    if (!config.github.enabled) return getResponse(HttpStatusCode.IM_A_TEAPOT);

    const account = await System.accounts.getFromRequest(request);

    System.db.delete(["github", account.accountId]);

    return getResponse(HttpStatusCode.OK);
  },
};
