import { RequestMethod } from "@oh/utils";
import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";

export const buyFurnitureRequest: ProxyRequestType = {
  pathname: "/buy",
  method: RequestMethod.POST,
  func: async ({ user, data }) => {
    const { roomId, furnitureId } = data;

    if (!roomId || !furnitureId) {
      return {
        status: 400,
        data: {
          error: "roomId and furnitureId are required",
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
          error: "Can only buy furniture from private rooms",
        },
      };
    }

    const result = await room.buyFurnitureFromRoom(
      user.getAccountId(),
      furnitureId,
    );

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
