import {
  RequestMethod,
  RequestType,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { RequestKind } from "shared/enums/request.enums.ts";
import { System } from "modules/system/main.ts";

export const emailGetRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/email",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    return getResponse(HttpStatusCode.OK, {
      data: {
        email: await account.getEmail(),
      },
    });
  },
};
