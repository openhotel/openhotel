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
  backupsDeleteRequest,
  backupsGetRequest,
  backupsPostRequest,
  backupsSyncGetRequest,
} from "./backups.request.ts";
import { hotelRequestList } from "./hotel/main.ts";
import {
  thirdPartyDeleteRequest,
  thirdPartyGetRequest,
  thirdPartyPostRequest,
} from "./third-party.request.ts";

export const adminRequestList: RequestType[] = getPathRequestList({
  requestList: [
    adminPostRequest,
    updatePatchRequest,
    //
    tokensDeleteRequest,
    tokensGetRequest,
    tokensPostRequest,
    //
    thirdPartyDeleteRequest,
    thirdPartyGetRequest,
    thirdPartyPostRequest,
    //
    usersGetRequest,
    userDeleteRequest,
    userPatchRequest,
    userResendVerificationRequest,
    //
    ...hotelRequestList,
    //
    backupsGetRequest,
    backupsPostRequest,
    backupsDeleteRequest,
    backupsSyncGetRequest,
  ],
  pathname: "/admin",
});
