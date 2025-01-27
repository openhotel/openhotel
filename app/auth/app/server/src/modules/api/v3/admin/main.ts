import { RequestType, getPathRequestList } from "@oh/utils";
import { updateGetRequest } from "./update.request.ts";
import { adminPostRequest, adminDeleteRequest } from "./main.request.ts";
import {
  tokensDeleteRequest,
  tokensGetRequest,
  tokensPostRequest,
} from "./tokens.request.ts";
import { hotelsDeleteRequest, hotelsGetRequest } from "./hotels.request.ts";
import { usersGetRequest } from "./users.request.ts";
import { userDeleteRequest, userPatchRequest } from "./user.request.ts";
import { userResendVerificationRequest } from "./user-resend-verification.request.ts";

export const adminRequestList: RequestType[] = getPathRequestList({
  requestList: [
    adminPostRequest,
    adminDeleteRequest,
    updateGetRequest,
    tokensDeleteRequest,
    tokensGetRequest,
    tokensPostRequest,
    usersGetRequest,
    userDeleteRequest,
    userPatchRequest,
    userResendVerificationRequest,
    hotelsGetRequest,
    hotelsDeleteRequest,
  ],
  pathname: "/admin",
});
