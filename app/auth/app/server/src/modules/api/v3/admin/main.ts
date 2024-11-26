import { RequestType, getPathRequestList } from "@oh/utils";
import { updateGetRequest } from "./update.request.ts";
import { adminPostRequest, adminDeleteRequest } from "./main.request.ts";
import {
  tokensDeleteRequest,
  tokensGetRequest,
  tokensPostRequest,
} from "./tokens.request.ts";
import { hotelsGetRequest } from "./hotels.request.ts";
import { usersGetRequest } from "./users.request.ts";

export const adminRequestList: RequestType[] = getPathRequestList({
  requestList: [
    adminPostRequest,
    adminDeleteRequest,
    updateGetRequest,
    tokensDeleteRequest,
    tokensGetRequest,
    tokensPostRequest,
    hotelsGetRequest,
    usersGetRequest,
  ],
  pathname: "/admin",
});
