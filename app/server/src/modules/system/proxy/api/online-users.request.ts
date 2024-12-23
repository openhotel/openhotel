import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const onlineUsersRequest: ProxyRequestType = {
  pathname: "/online-users",
  method: RequestMethod.GET,
  func: async ({}) => {
    return {
      status: 200,
      data: {
        count: System.game.users.getList().length,
      },
    };
  },
};
