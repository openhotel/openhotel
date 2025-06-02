import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";
import { ulid } from "@std/ulid";
import { PrivateRoom } from "shared/types/rooms/private.types.ts";

export const roomRequest: ProxyRequestType = {
  pathname: "",
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

    switch (foundRoom.type) {
      case "private":
        return {
          status: 200,
          data: {
            room: {
              furniture: [
                ...new Set(
                  foundRoom
                    .getFurniture()
                    .map(({ furnitureId }) => furnitureId),
                ),
              ],
            },
          },
        };
      case "public":
        return null;
    }
  },
};

export const roomPutRequest: ProxyRequestType = {
  pathname: "",
  method: RequestMethod.PUT,
  func: async ({ data, user }) => {
    const { layoutId, title, description } = data as unknown as {
      layoutId: number;
      title: string;
      description: string | null;
    };
    if (!title || 3 > title.trim().length || isNaN(layoutId))
      return { status: 400 };

    if (!(await System.game.rooms.layout.get(layoutId))) return { status: 400 };

    const roomData: PrivateRoom = {
      type: "private",
      version: 1,
      id: ulid(),
      ownerId: user.getAccountId(),
      title: title.trim().substring(0, Math.min(title.length, 32)),
      description: description
        ? description.substring(0, Math.min(description.length, 64))
        : null,
      furniture: [],
      layoutIndex: layoutId,
      maxUsers: 10,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await System.game.rooms.add(roomData);

    return {
      status: 200,
      data: {
        room: roomData,
      },
    };
  },
};
