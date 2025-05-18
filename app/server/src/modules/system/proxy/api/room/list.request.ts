import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";
import { PrivateRoomMutable } from "shared/types/rooms/private.types.ts";
import { PublicRoomMutable } from "shared/types/rooms/public.types.ts";

export const listRequest: ProxyRequestType = {
  pathname: "/list",
  method: RequestMethod.GET,
  func: async ({ data: { type, ownerId }, user }) => {
    if (type !== "public" && type !== "private")
      return {
        status: 500,
      };

    switch (type) {
      case "public":
        const publicRooms =
          await System.game.rooms.getList<PublicRoomMutable>("public");
        const $publicRooms = (
          await Promise.all(
            publicRooms.map(async (room) => ({
              id: room.getId(),
              title: room.getTitle(),
              description: room.getDescription(),
              userCount: room.getUsers().length,
              maxUsers: room.getObject().maxUsers,
            })),
          )
        ).sort((roomA, roomB) => (roomA.userCount > roomB.userCount ? 1 : -1));

        return {
          status: 200,
          data: {
            rooms: $publicRooms,
          },
        };
      case "private":
        const privateRooms =
          await System.game.rooms.getList<PrivateRoomMutable>("private");
        const $privateRooms = (
          await Promise.all(
            privateRooms
              .filter((room) => !ownerId || room.getOwnerId() === ownerId)
              .map(async (room) => ({
                id: room.getId(),
                ownerId: room.getOwnerId(),
                ownerUsername: await room.getOwnerUsername(),
                title: room.getTitle(),
                description: room.getDescription(),
                userCount: room.getUsers().length,
                maxUsers: room.getObject().maxUsers,
                layoutIndex: room.getObject().layoutIndex,
              })),
          )
        ).sort((roomA, roomB) => (roomA.title > roomB.title ? 1 : -1));

        return {
          status: 200,
          data: {
            rooms: $privateRooms,
          },
        };
    }
  },
};
