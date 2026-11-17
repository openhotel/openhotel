import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";

export const layoutsRequest: ProxyRequestType = {
  pathname: "/layouts",
  method: RequestMethod.GET,
  public: true,
  func: async ({}, url) => {
    const layouts = await System.game.rooms.layout.getList();

    return {
      status: 200,
      data: {
        layouts,
      },
    };
  },
};
