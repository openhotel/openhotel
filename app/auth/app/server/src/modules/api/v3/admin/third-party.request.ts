import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const thirdPartyGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/third-party",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const tokens = (await System.thirdParty.getList()).map(({ id, url }) => ({
      id,
      url,
    }));

    return getResponse(HttpStatusCode.OK, { data: { tokens } });
  },
};

export const thirdPartyPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/third-party",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { url } = await request.json();

    if (!url) return getResponse(HttpStatusCode.BAD_REQUEST);

    const { id, token } = await System.thirdParty.generate(url);

    return getResponse(HttpStatusCode.OK, {
      data: {
        id,
        url,
        token,
      },
    });
  },
};

export const thirdPartyDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/third-party",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    const id = url.searchParams.get("id");
    if (!id) return getResponse(HttpStatusCode.BAD_REQUEST);

    await System.thirdParty.remove(id);

    return getResponse(HttpStatusCode.OK);
  },
};
