import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const tokenRequest: ProxyRequestType = {
  pathname: "/token",
  method: RequestMethod.GET,
  public: true,
  func: async ({}, url) => {
    const token = url.searchParams.get("token");

    return {
      status: System.isTokenValid(token) ? 200 : 403,
    };
  },
};
