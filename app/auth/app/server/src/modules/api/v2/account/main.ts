import { RequestType } from "shared/types/main.ts";
import { getPathRequestList } from "shared/utils/main.ts";

import { otpRequestList } from "./otp/main.ts";

import { registerRequest } from "./register.request.ts";
import { loginRequest } from "./login.request.ts";
import { verifyRequest } from "./verify.request.ts";
import { refreshSessionRequest } from "./refresh-session.request.ts";
import { logoutRequest } from "./logout.request.ts";
import { accountGetRequest } from "./account.request.ts";
import { pingRequest } from "./ping.request.ts";

export const accountRequestList: RequestType[] = getPathRequestList({
  requestList: [
    registerRequest,
    loginRequest,
    verifyRequest,
    refreshSessionRequest,
    logoutRequest,
    accountGetRequest,
    pingRequest,

    ...otpRequestList,
  ],
  pathname: "/account",
});
