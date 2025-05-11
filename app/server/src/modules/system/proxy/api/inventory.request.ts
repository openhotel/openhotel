import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";

export const inventoryRequest: ProxyRequestType = {
  pathname: "/inventory",
  method: RequestMethod.GET,
  func: async ({ user, data: { type } }) => {
    const furniture = await user.getInventory();

    const $type = isNaN(parseInt(type))
      ? FurnitureType.FURNITURE
      : (parseInt(type) as FurnitureType);

    return {
      status: 200,
      data: {
        furniture: furniture.filter((furniture) => furniture.type === $type),
      },
    };
  },
};
