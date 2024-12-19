import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const userOnlineRequest: ProxyRequestType = {
  pathname: "/user-online",
  method: RequestMethod.GET,
  func: async ({ data, user }) => {
    return {
      status: 200,
      data: {
        count: System.game.users.getList().length,
      },
    };
  },
};
