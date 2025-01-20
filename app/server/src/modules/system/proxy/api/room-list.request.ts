import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const roomListRequest: ProxyRequestType = {
  pathname: "/room-list",
  method: RequestMethod.GET,
  func: async ({ data: { type }, user }) => {
    if (type !== "public" && type !== "private")
      return {
        status: 500,
      };

    switch (type) {
      case "public":
        return {
          status: 200,
          data: {
            rooms: [],
          },
        };
      case "private":
        const roomsData = await System.game.rooms.private.getList();
        const rooms = (
          await Promise.all(
            roomsData.map(async (room) => ({
              id: room.getId(),
              ownerId: room.getOwnerId(),
              ownerUsername: await room.getOwnerUsername(),
              title: room.getTitle(),
              description: room.getDescription(),
              userCount: room.getUsers().length,
            })),
          )
        ).sort((roomA, roomB) => (roomA.title > roomB.title ? 1 : -1));

        return {
          status: 200,
          data: {
            rooms,
          },
        };
    }
  },
};
