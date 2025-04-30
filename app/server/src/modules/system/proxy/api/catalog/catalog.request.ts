import { RequestMethod } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { isCatalogCategoryAvailable } from "shared/utils/catalog.utils.ts";

export const catalogRequest: ProxyRequestType = {
  pathname: "",
  method: RequestMethod.GET,
  func: async ({}, url) => {
    const category = url.searchParams.get("category");

    const catalog = await System.game.furniture.getCatalog();

    if (!category) {
      const categories = catalog.categories
        .filter(isCatalogCategoryAvailable)
        .map((category) => ({
          id: category.id,
          label: category.label,
          description: category.description,
        }));

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
        furniture,
      },
    };
  },
};
