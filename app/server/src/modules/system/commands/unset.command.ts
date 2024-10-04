import { Command } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { __, isPoint3dEqual } from "shared/utils/main.ts";

export const unsetCommand: Command = {
  command: "unset",
  func: async ({ user, args }) => {
    if (2 > args.length) return;

    const [x, z] = args as [number, number];
    if (isNaN(x) || isNaN(z)) return;

    const roomId = user.getRoom();
    if (!roomId) return;

    const room = System.game.rooms.get(roomId);
    const furniture = room
      .getFurnitures()
      .find((furniture) => isPoint3dEqual(furniture.position, { x, y: 0, z }));

    if (!furniture) {
      user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: __(user.getLanguage(), "Furniture not found on {{x}},{{z}}", {
          x: x.toString(),
          z: z.toString(),
        }),
      });
      return;
    }

    room.removeFurniture(furniture);
    room.emit(ProxyEvent.REMOVE_FURNITURE, {
      furniture,
    });
  },
};
