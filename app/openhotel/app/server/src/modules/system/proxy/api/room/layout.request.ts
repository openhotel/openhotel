import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@shared/enums/request.enums.ts";
import { getContentType } from "@shared/utils/content-type.utils.ts";

export const layoutRequest: ProxyRequestType = {
  pathname: "/layout",
  method: RequestMethod.GET,
  public: true,
  func: async ({}, url) => {
    const layoutId = parseInt(url.searchParams.get("id"));

    if (isNaN(layoutId))
      return {
        status: 404,
      };

    const data = await System.game.rooms.layout.getImage(layoutId);

    if (!data)
      return {
        status: 404,
      };

    return {
      status: 200,
      data,
      headers: {
        "Content-Type": getContentType(".png"),
      },
    };
  },
};
