import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";

export const marketplaceListRequest: ProxyRequestType = {
  pathname: "/list",
  method: RequestMethod.POST,
  func: async ({ user, data }) => {
    const { instanceId, listPrice } = data;

    if (!instanceId || listPrice === undefined) {
      return {
        status: 400,
        data: {
          error: "instanceId and listPrice are required",
        },
      };
    }

    const price = parseInt(listPrice);
    if (isNaN(price) || price <= 0) {
      return {
        status: 400,
        data: {
          error: "listPrice must be a positive number",
        },
      };
    }

    const result = await System.game.marketplace.listFurniture(
      user.getAccountId(),
      instanceId,
      price,
    );

    if (!result.success) {
      return {
        status: 400,
        data: {
          error: result.error,
        },
      };
    }

    return {
      status: 200,
      data: {
        listing: result.listing,
      },
    };
  },
};
