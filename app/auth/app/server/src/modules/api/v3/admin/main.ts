import { RequestType, getPathRequestList } from "@oh/utils";
import { updatePatchRequest } from "./update.request.ts";
import { adminPostRequest } from "./main.request.ts";
import {
  tokensDeleteRequest,
  tokensGetRequest,
  tokensPostRequest,
} from "./tokens.request.ts";
import { usersGetRequest } from "./users.request.ts";
import { userDeleteRequest, userPatchRequest } from "./user.request.ts";
import { userResendVerificationRequest } from "./user-resend-verification.request.ts";
import {
  backupDeleteRequest,
  backupGetRequest,
  backupPostRequest,
  backupsGetRequest,
} from "./backup.request.ts";
import { hotelRequestList } from "./hotel/main.ts";
import {
  appsDeleteRequest,
  appsGetRequest,
  appsPostRequest,
} from "./apps.request.ts";

export const adminRequestList: RequestType[] = getPathRequestList({
  requestList: [
    adminPostRequest,
    updatePatchRequest,
    //
    tokensDeleteRequest,
    tokensGetRequest,
    tokensPostRequest,
    //
    appsDeleteRequest,
    appsGetRequest,
    appsPostRequest,
    //
    usersGetRequest,
    userDeleteRequest,
    userPatchRequest,
    userResendVerificationRequest,
    //
    ...hotelRequestList,
    //
    backupsGetRequest,
    backupGetRequest,
    backupPostRequest,
    backupDeleteRequest,
  ],
  pathname: "/admin",
});
