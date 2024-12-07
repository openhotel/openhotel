import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { hasRequestAccess } from "shared/utils/scope.utils.ts";
import { System } from "modules/system/main.ts";

export const tokensGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/tokens",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

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
    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

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
    if (!(await hasRequestAccess({ request, admin: true })))
      return getResponse(HttpStatusCode.FORBIDDEN);

    const id = url.searchParams.get("id");
    if (!id) return getResponse(HttpStatusCode.BAD_REQUEST);

    await System.tokens.remove(id);

    return getResponse(HttpStatusCode.OK);
  },
};
