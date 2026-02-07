import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";

export const marketplaceRequest: ProxyRequestType = {
  pathname: "",
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

    const listings =
      await System.game.marketplace.getListingsByFurnitureId(furnitureId);
    const cheapestListing =
      await System.game.marketplace.getCheapestListing(furnitureId);
    const catalogPrice =
      await System.game.marketplace.getCatalogPriceForFurniture(furnitureId);

    return {
      status: 200,
      data: {
        listings,
        cheapestListing,
        catalogPrice,
        count: listings.length,
      },
    };
  },
};
