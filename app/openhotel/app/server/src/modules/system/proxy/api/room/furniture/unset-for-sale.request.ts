import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";

export const unsetForSaleRequest: ProxyRequestType = {
  pathname: "/unset-for-sale",
  method: RequestMethod.POST,
  func: async ({ user, data }) => {
    const { furnitureId } = data;

    if (!furnitureId) {
      return {
        status: 400,
        data: {
          error: "furnitureId is required",
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
          error: "Can only manage furniture sales in private rooms",
        },
      };
    }

    if (room.getOwnerId() !== user.getAccountId()) {
      return {
        status: 403,
        data: {
          error: "Only the room owner can unset furniture for sale",
        },
      };
    }

    const result = await room.unsetFurnitureForSale(furnitureId);

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
