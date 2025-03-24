import { RequestType, getPathRequestList } from "@oh/utils";

import { captchaRequest } from "./captcha.request.ts";
import { versionRequest } from "./version.request.ts";

export const miscRequestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest, captchaRequest],
  pathname: "/_",
});
