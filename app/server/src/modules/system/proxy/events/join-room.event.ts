import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { __ } from "shared/utils/main.ts";
import { getLatestVersion } from "@oh/utils";

export const joinRoomEvent: ProxyEventType<{ roomId: string }> = {
  event: ProxyEvent.JOIN_ROOM,
  func: async ({ data: { roomId }, user }) => {
    const currentRoom = user.getRoom();
    if (currentRoom)
      (await System.game.rooms.get(currentRoom)).removeUser(user.getObject());

    await (await System.game.rooms.get(roomId))?.addUser?.(user.getObject());

    const { version: configVersion } = System.getConfig();
    if (configVersion === "development") return;

    const isOp = (await System.game.users.getConfig()).op.users.includes(
      user.getUsername(),
    );
    if (!isOp) return;

    const { version } = System.getEnvs();
    const newVersion = await getLatestVersion({
      version,
      repository: "openhotel/openhotel",
    });
    if (!newVersion) return;

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: __(user.getLanguage())("New version {{newVersion}} available!", {
        newVersion,
      }),
    });
  },
};
