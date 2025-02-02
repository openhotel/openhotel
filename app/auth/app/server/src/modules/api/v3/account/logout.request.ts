import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const logoutPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/logout",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    await account.removeTokens();

    return getResponse(HttpStatusCode.OK);
  },
};
