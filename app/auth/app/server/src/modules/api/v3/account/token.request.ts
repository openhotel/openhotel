import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const tokenGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/token",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    const tokens = await account.getTokens();

    return getResponse(HttpStatusCode.OK, {
      data: {
        tokens,
      },
    });
  },
};

export const tokenDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/token",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    const tokenId = new URL(request.url).searchParams.get("tokenId");
    if (!tokenId) return getResponse(HttpStatusCode.BAD_REQUEST);

    await account.removeToken(tokenId);
    return getResponse(HttpStatusCode.OK);
  },
};
