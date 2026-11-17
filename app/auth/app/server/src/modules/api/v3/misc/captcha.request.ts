import { System } from "modules/system/main.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { RequestKind, RequestMethod } from "@shared/enums/request.enums.ts";
import { getResponse } from "@shared/utils/response.utils.ts";
import { HttpStatusCode } from "@shared/enums/http-status-code.enums.ts";

export const captchaRequest: RequestType = {
  method: RequestMethod.GET,
  pathname: "/captcha",
  kind: RequestKind.PUBLIC,
  func: async () => {
    const isEnabled = System.captcha.isEnabled();
    const { siteKey } = System.getConfig().captcha;
    return getResponse(
      HttpStatusCode.OK,
      isEnabled
        ? {
            enabled: isEnabled,
            siteKey,
            url: System.captcha.getUrl(),
          }
        : { enabled: false },
    );
  },
};
