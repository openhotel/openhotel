import {
  RequestType,
  RequestMethod,
  getResponse,
  HttpStatusCode,
  RequestKind,
} from "@oh/utils";
import { System } from "modules/system/main.ts";

export const captchaRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/captcha",
  kind: RequestKind.PUBLIC,
  func: async () => {
    const isEnabled = System.captcha.isEnabled();
    return getResponse(HttpStatusCode.OK, {
      enabled: isEnabled,
    });
  },
};
