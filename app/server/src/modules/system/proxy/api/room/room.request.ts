import { ProxyRequestType } from "shared/types/api.types.ts";
import { System } from "modules/system/main.ts";
import { RequestMethod } from "@oh/utils";

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
    // const { layout, title, description } = data;
    // if (!title || !description || !layout || !Array.isArray(layout)) {
    //   return { status: 400 };
    // }
    //
    // if (layout.length < 2) {
    //   return { status: 400 };
    // }
    //
    // for (const row of layout) {
    //   if (typeof row !== "string" || row.length < 2) {
    //     return { status: 400 };
    //   }
    // }
    //
    // let hasSpawn = false;
    // let hasFloor = false;
    // for (const row of layout) {
    //   if (row.includes("s")) {
    //     hasSpawn = true;
    //   }
    //   if (/\d/.test(row)) {
    //     hasFloor = true;
    //   }
    // }
    //
    // if (!hasSpawn || !hasFloor) {
    //   return { status: 400 };
    // }
    //
    // const $layout: RoomPoint[][] = layout.map((line) =>
    //   line
    //     .split("")
    //     .map((value) =>
    //       parseInt(value)
    //         ? parseInt(value)
    //         : (value.toLowerCase() as RoomPointEnum),
    //     ),
    // );
    //
    // const roomData: PrivateRoom = {
    //   type: "private",
    //   version: 1,
    //   id: ulid(),
    //   ownerId: user.getAccountId(),
    //   title,
    //   description,
    //   furniture: [],
    //   layout: $layout,
    //   layoutIndex:
    //   spawnPoint: getRoomSpawnPoint($layout),
    //   spawnDirection: getRoomSpawnDirection($layout),
    //   maxUsers: 10,
    // };
    //
    // await System.game.rooms.add(roomData);

    return {
      status: 200,
      data: {
        // room: roomData,
      },
    };
  },
};
