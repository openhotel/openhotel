import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod, getContentType } from "@oh/utils";

export const furnitureRequest: ProxyRequestType = {
  match: /\/furniture(\/(sheet\.json|sprite\.png))?/,
  method: RequestMethod.GET,
  public: true,
  func: async ({}, url) => {
    const fileType = url.pathname.split("/").reverse()[0];
    const furnitureId = url.searchParams.get("furnitureId");

    const furnitureData = await System.game.furniture.getData(furnitureId);
    if (!furnitureData) {
      return {
        status: 404,
      };
    }

    const [data, sheet, sprite] = furnitureData;

    switch (fileType) {
      case "sheet.json":
        return {
          status: 200,
          data: JSON.stringify(sheet),
          headers: {
            "Content-Type": getContentType(".json"),
          },
        };
      case "sprite.png":
        return {
          status: 200,
          data: sprite,
          headers: {
            "Content-Type": getContentType(".png"),
          },
        };
    }

    return {
      status: 200,
      data: JSON.stringify(data),
      headers: {
        "Content-Type": getContentType(".json"),
      },
    };
  },
};
