import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const githubGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/github",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request, url: URL) => {
    const config = System.getConfig();

    const enabled = url.searchParams.get("enabled");
    if (enabled)
      return getResponse(HttpStatusCode.OK, {
        enabled: config.github.enabled,
      });

    if (!config.github.enabled) return getResponse(HttpStatusCode.IM_A_TEAPOT);

    const account = await System.accounts.getAccount({ request });

    return getResponse(HttpStatusCode.OK, {
      url: await account.github.generateUri(),
    });
  },
};

export const githubPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/github",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const config = System.getConfig();
    if (!config.github.enabled) return getResponse(HttpStatusCode.IM_A_TEAPOT);

    const { code, state } = await request.json();

    const account = await System.accounts.getAccount({ request });

    if (await account.github.checkState(state))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const login = await account.github.link(code);

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
    const config = System.getConfig();
    if (!config.github.enabled) return getResponse(HttpStatusCode.IM_A_TEAPOT);

    const account = await System.accounts.getAccount({ request });

    await account.github.unlink();

    return getResponse(HttpStatusCode.OK);
  },
};
