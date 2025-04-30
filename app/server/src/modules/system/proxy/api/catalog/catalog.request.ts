import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";
import dayjs from "dayjs";

export const catalogRequest: ProxyRequestType = {
  pathname: "",
  method: RequestMethod.GET,
  func: async ({}, url) => {
    const category = url.searchParams.get("category");

    const catalog = await System.game.furniture.getCatalog();

    if (!category) {
      const categories = catalog.categories
        .filter((catalog) => {
          const from = catalog?.range?.from;
          const to = catalog?.range?.to;

          return (
            catalog.enabled &&
            (!from || dayjs(dayjs()).diff(from, "minutes") >= 0) &&
            (!to || dayjs(to).diff(dayjs(), "minutes") > 0)
          );
        })
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
