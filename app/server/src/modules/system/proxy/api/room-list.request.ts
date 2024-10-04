import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "shared/enums/request.enum.ts";

export const roomListRequest: ProxyRequestType = {
  pathname: "/room-list",
  method: RequestMethod.GET,
  func: ({ data, user }) => {
    data.type;
    const rooms = System.game.rooms.getList().map((room) => ({
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
