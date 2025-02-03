import { RequestType, getPathRequestList } from "@oh/utils";
import { updatePatchRequest } from "./update.request.ts";
import { adminPostRequest } from "./main.request.ts";
import {
  tokensDeleteRequest,
  tokensGetRequest,
  tokensPostRequest,
} from "./tokens.request.ts";
import { hotelsDeleteRequest, hotelsGetRequest } from "./hotels.request.ts";
import { usersGetRequest } from "./users.request.ts";
import { userDeleteRequest, userPatchRequest } from "./user.request.ts";
import { userResendVerificationRequest } from "./user-resend-verification.request.ts";
import {
  backupsDeleteRequest,
  backupsGetRequest,
  backupsPostRequest,
} from "./backups.request.ts";

export const adminRequestList: RequestType[] = getPathRequestList({
  requestList: [
    adminPostRequest,
    updatePatchRequest,
    //
    tokensDeleteRequest,
    tokensGetRequest,
    tokensPostRequest,
    //
    usersGetRequest,
    userDeleteRequest,
    userPatchRequest,
    userResendVerificationRequest,
    //
    hotelsGetRequest,
    hotelsDeleteRequest,
    //
    backupsGetRequest,
    backupsPostRequest,
    backupsDeleteRequest,
  ],
  pathname: "/admin",
});
