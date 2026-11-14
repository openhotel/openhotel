import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const adminPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "",
  kind: RequestKind.PUBLIC,
  func: async (request: Request, url: URL) => {
    const adminList = await System.accounts.admins.getList();

    const account = await System.accounts.getAccount({ request });

    //if no admins, first to call the request, is admin
    if (adminList.length) return getResponse(HttpStatusCode.FORBIDDEN);

    await account.setAdmin(true);
    return getResponse(HttpStatusCode.OK);
  },
};
