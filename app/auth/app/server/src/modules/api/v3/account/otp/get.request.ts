import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const getRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "",
  kind: RequestKind.ACCOUNT,
  func: async (request: Request) => {
    const account = await System.accounts.getAccount({ request });

    if (await account.otp.isVerified())
      return getResponse(HttpStatusCode.CONFLICT);

    return getResponse(HttpStatusCode.OK, {
      data: { uri: await account.otp.create() },
    });
  },
};
