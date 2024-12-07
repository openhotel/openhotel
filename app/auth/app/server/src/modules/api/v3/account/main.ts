import { RequestType, getPathRequestList } from "@oh/utils";

import { loginPostRequest } from "./login.request.ts";
import { registerPostRequest } from "./register.request.ts";
import { verifyGetRequest } from "./verify.request.ts";
import { refreshGetRequest } from "./refresh.request.ts";
import { logoutPostRequest } from "./logout.request.ts";
import { otpRequestList } from "./otp/main.ts";
import { miscRequestList } from "./misc/main.ts";

export const accountRequestList: RequestType[] = getPathRequestList({
  requestList: [
    loginPostRequest,
    registerPostRequest,
    verifyGetRequest,
    refreshGetRequest,
    logoutPostRequest,

    ...otpRequestList,
    ...miscRequestList,
  ],
  pathname: "/account",
});
