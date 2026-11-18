import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

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
