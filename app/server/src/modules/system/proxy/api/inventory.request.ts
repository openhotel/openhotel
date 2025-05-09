import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";

export const inventoryRequest: ProxyRequestType = {
  pathname: "/inventory",
  method: RequestMethod.GET,
  func: async ({ user }) => {
    const furniture = await user.getInventory();
    return {
      status: 200,
      data: {
        furniture,
      },
    };
  },
};
