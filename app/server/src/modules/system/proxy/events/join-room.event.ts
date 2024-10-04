import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { __ } from "shared/utils/main.ts";
import { getLatestVersion } from "@oh/updater";

export const joinRoomEvent: ProxyEventType<{ roomId: string }> = {
  event: ProxyEvent.JOIN_ROOM,
  func: async ({ data: { roomId }, user }) => {
    const getRoom = System.game.rooms.get;

    const currentRoom = user.getRoom();
    if (currentRoom) getRoom(currentRoom).removeUser(user.getObject());

    getRoom(roomId)?.addUser?.(user.getObject());

    const { version, isDevelopment } = System.getEnvs();
    if (isDevelopment) return;

    const isOp = (await System.game.users.getConfig()).op.users.includes(
      user.getUsername(),
    );
    if (!isOp) return;

    const newVersion = await getLatestVersion({
      version,
      repository: "openhotel/openhotel",
    });
    if (!newVersion) return;

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: __(user.getLanguage(), "New version {{newVersion}} available!", {
        newVersion,
      }),
    });
  },
};
