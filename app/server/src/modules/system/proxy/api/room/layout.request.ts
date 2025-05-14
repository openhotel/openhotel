import { ProxyRequestType } from "shared/types/api.types.ts";
import { RequestMethod, getContentType } from "@oh/utils";
import { System } from "modules/system/main.ts";

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
