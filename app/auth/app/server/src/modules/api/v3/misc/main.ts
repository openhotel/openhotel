import { captchaRequest } from "./captcha.request.ts";
import { versionRequest } from "./version.request.ts";
import { RequestType } from "@shared/types/request.types.ts";
import { getPathRequestList } from "@shared/utils/request.utils.ts";

export const miscRequestList: RequestType[] = getPathRequestList({
  requestList: [versionRequest, captchaRequest],
  pathname: "/_",
});
