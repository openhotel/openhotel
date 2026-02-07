import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";

export const marketplacePriceLimitsRequest: ProxyRequestType = {
  pathname: "/price-limits",
  method: RequestMethod.GET,
  func: async ({}, url) => {
    const furnitureId = url.searchParams.get("furnitureId");

    if (!furnitureId) {
      return {
        status: 400,
        data: {
          error: "furnitureId is required",
        },
      };
    }

    const priceLimits =
      await System.game.marketplace.getPriceLimits(furnitureId);

    if (!priceLimits) {
      return {
        status: 404,
        data: {
          error: "Furniture not found in catalog",
        },
      };
    }

    const isRetired =
      await System.game.marketplace.isRetiredFurniture(furnitureId);
    const config = System.game.marketplace.getConfig();

    let commissionRate = config.commissionRate;
    if (isRetired) {
      commissionRate += config.retiredCommissionRate;
    }

    return {
      status: 200,
      data: {
        ...priceLimits,
        isRetired,
        commissionRate,
      },
    };
  },
};
