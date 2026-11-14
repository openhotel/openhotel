import { ProxyRequestType } from "shared/types/api.types.ts";
import { RequestMethod, getContentType } from "@oh/utils";
import { System } from "modules/system/main.ts";

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
