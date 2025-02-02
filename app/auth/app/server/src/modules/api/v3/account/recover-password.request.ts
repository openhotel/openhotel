import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
} from "@oh/utils";
import { System } from "modules/system/main.ts";
import { EMAIL_REGEX } from "shared/consts/main.ts";
import { RequestKind } from "shared/enums/request.enums.ts";

export const recoverPasswordPostRequest: RequestType = {
  method: RequestMethod.POST,
  pathname: "/recover-password",
  kind: RequestKind.PUBLIC,
  func: async (request: Request) => {
    try {
      let { email } = await request.json();

      email = email?.toLowerCase();

      if (!email || !new RegExp(EMAIL_REGEX).test(email)) {
        return getResponse(HttpStatusCode.BAD_REQUEST, {
          message: "Invalid email",
        });
      }

      const response = await System.accounts.sendRecover(email);
      if (!response) return getResponse(HttpStatusCode.OK);

      if (!isNaN(response)) return getResponse(response);

      const { version } = System.getConfig();

      const isDevelopment = version === "development";

      if (isDevelopment && typeof response === "string")
        return getResponse(HttpStatusCode.OK, {
          redirectUrl: response,
        });

      return getResponse(HttpStatusCode.OK);
    } catch (e) {
      return getResponse(HttpStatusCode.BAD_REQUEST);
    }
  },
};
