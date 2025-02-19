import { RequestType, getPathRequestList } from "@oh/utils";
import { mainGetRequest, mainPatchRequest } from "./main.request.ts";
import { connectionRequestList } from "./connection/main.ts";
import { scopesGetRequest } from "./scopes.request.ts";
import { emailGetRequest } from "./email.request.ts";
import { hotelRequestList } from "./hotel/main.ts";
import { appsGetRequest } from "./apps.request.ts";

export const meRequestList: RequestType[] = getPathRequestList({
  requestList: [
    mainGetRequest,
    mainPatchRequest,
    scopesGetRequest,
    emailGetRequest,
    appsGetRequest,
    ...connectionRequestList,
    ...hotelRequestList,
  ],
  pathname: "/@me",
});
