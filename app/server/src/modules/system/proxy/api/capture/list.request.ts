import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const listRequest: ProxyRequestType = {
  pathname: "/list",
  method: RequestMethod.GET,
  token: true,
  func: async ({}, url) => {
    return {
      status: 200,
      data: {
        list: await System.phantom.getCaptureList(),
      },
    };
  },
};
