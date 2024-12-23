import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const roomRequest: ProxyRequestType = {
  pathname: "/room",
  method: RequestMethod.GET,
  func: async ({ data, user }, url) => {
    const roomId = url.searchParams.get("roomId");
    if (!roomId)
      return {
        status: 404,
      };

    const foundRoom = await System.game.rooms.get(roomId);
    if (!foundRoom)
      return {
        status: 404,
      };

    return {
      status: 200,
      data: {
        room: {
          furniture: [
            ...new Set(
              foundRoom.getFurnitures().map(({ furnitureId }) => furnitureId),
            ),
          ],
        },
      },
    };
  },
};
