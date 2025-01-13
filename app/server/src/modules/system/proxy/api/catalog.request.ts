import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const catalogRequest: ProxyRequestType = {
  pathname: "/catalog",
  method: RequestMethod.GET,
  public: true,
  func: async ({}, url) => {
    const category = url.searchParams.get("category");

    const catalog = System.game.furniture.getCatalog();

    if (!category) {
      const categories = catalog.categories.map((category) => category.id);

      return {
        status: 200,
        data: {
          categories,
        },
      };
    }

    const furniture = await System.game.furniture.getCatalogFurniture(category);

    return {
      status: 200,
      data: {
        catalogFurniture: furniture,
      },
    };
  },
};
