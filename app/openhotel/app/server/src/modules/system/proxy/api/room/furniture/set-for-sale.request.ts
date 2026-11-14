import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";

export const setForSaleRequest: ProxyRequestType = {
  pathname: "/set-for-sale",
  method: RequestMethod.POST,
  func: async ({ user, data }) => {
    const { furnitureId, price } = data;

    if (!furnitureId || price === undefined) {
      return {
        status: 400,
        data: {
          error: "furnitureId and price are required",
        },
      };
    }

    const parsedPrice = parseInt(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return {
        status: 400,
        data: {
          error: "price must be a positive number",
        },
      };
    }

    const roomId = user.getRoom();
    if (!roomId) {
      return {
        status: 400,
        data: {
          error: "You must be in a room",
        },
      };
    }

    const room = await System.game.rooms.get(roomId);
    if (!room) {
      return {
        status: 404,
        data: {
          error: "Room not found",
        },
      };
    }

    if (room.type !== "private") {
      return {
        status: 400,
        data: {
          error: "Can only sell furniture in private rooms",
        },
      };
    }

    if (room.getOwnerId() !== user.getAccountId()) {
      return {
        status: 403,
        data: {
          error: "Only the room owner can set furniture for sale",
        },
      };
    }

    const result = await room.setFurnitureForSale(furnitureId, parsedPrice);

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
        success: true,
      },
    };
  },
};
