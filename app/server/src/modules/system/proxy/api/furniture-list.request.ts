import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const furnitureListRequest: ProxyRequestType = {
  pathname: "/furniture-list",
  method: RequestMethod.GET,
  public: true,
  func: async () => {
    try {
      const furnituresData = await System.game.furniture.getList();

      const furnitures = furnituresData.map((furniture) => ({
        id: furniture.id,
        type: furniture.type,
        label: furniture.label,
      }));

      return {
        status: 200,
        data: {
          furnitures,
        },
      };
    } catch (error) {
      console.error("Error fetching furniture list:", error);
      return {
        status: 500,
        data: { error: "Failed to fetch furniture list" },
      };
    }
  },
};
