import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const appsGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/apps",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const tokens = (await System.apps.getList()).map(({ id, url }) => ({
      id,
      url,
    }));

    return getResponse(HttpStatusCode.OK, { data: { tokens } });
  },
};

export const appsPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/apps",
  kind: RequestKind.ADMIN,
  func: async (request: Request) => {
    const { url } = await request.json();

    if (!url) return getResponse(HttpStatusCode.BAD_REQUEST);

    const { id, token } = await System.apps.generate(url);

    return getResponse(HttpStatusCode.OK, {
      data: {
        id,
        url,
        token,
      },
    });
  },
};

export const appsDeleteRequest: RequestType = {
  method: RequestMethod.DELETE,
  pathname: "/apps",
  kind: RequestKind.ADMIN,
  func: async (request: Request, url: URL) => {
    const id = url.searchParams.get("id");
    if (!id) return getResponse(HttpStatusCode.BAD_REQUEST);

    await System.apps.remove(id);

    return getResponse(HttpStatusCode.OK);
  },
};
