import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const tokensGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/tokens",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const tokens = (await System.tokens.getList()).map(({ id, label }) => ({
      id,
      label,
    }));

    return getResponse(HttpStatusCode.OK, { data: { tokens } });
  },
};

export const tokensPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/tokens",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { label } = await request.json();

    if (!label) return getResponse(HttpStatusCode.BAD_REQUEST);

    const { id, token } = await System.tokens.generate(label);

    return getResponse(HttpStatusCode.OK, {
      data: {
        id,
        label,
        token,
      },
    });
  },
};

export const tokensDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/tokens",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    const id = url.searchParams.get("id");
    if (!id) return getResponse(HttpStatusCode.BAD_REQUEST);

    await System.tokens.remove(id);

    return getResponse(HttpStatusCode.OK);
  },
};
