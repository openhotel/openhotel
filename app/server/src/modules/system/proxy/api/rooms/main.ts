import { RequestType, getPathRequestList } from "@oh/utils";

export const accountRequestList: RequestType[] = getPathRequestList({
  requestList: [
    loginPostRequest,
    registerPostRequest,
    verifyGetRequest,
    refreshGetRequest,
    logoutPostRequest,
    recoverPasswordPostRequest,
    changePasswordPostRequest,

    ...otpRequestList,
    ...miscRequestList,
  ],
  pathname: "/account",
});
