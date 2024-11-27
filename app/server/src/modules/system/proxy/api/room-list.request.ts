import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

export const roomListRequest: ProxyRequestType = {
  pathname: "/room-list",
  method: RequestMethod.GET,
  func: async ({ data, user }) => {
    const roomsData = await System.game.rooms.getList();
    const rooms = roomsData.map((room) => ({
      id: room.getId(),
      title: room.getTitle(),
      description: room.getDescription(),
      userCount: room.getUsers().length,
    }));
    return {
      status: 200,
      data: {
        rooms,
      },
    };
  },
};
