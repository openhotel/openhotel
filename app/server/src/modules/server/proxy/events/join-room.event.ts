import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { Server } from "modules/server/main.ts";
import { __, getLatestVersion, getUsersConfig } from "shared/utils/main.ts";

export const joinRoomEvent: ProxyEventType<{ roomId: string }> = {
  event: ProxyEvent.JOIN_ROOM,
  func: async ({ data: { roomId }, user }) => {
    const getRoom = Server.game.rooms.get;

    const currentRoom = user.getRoom();
    if (currentRoom) getRoom(currentRoom).removeUser(user.getObject());

    getRoom(roomId)?.addUser?.(user.getObject());

    const isOp = (await getUsersConfig()).op.users.includes(user.getUsername());
    if (isOp) {
      const newVersion = await getLatestVersion(Server.getEnvs());
      if (newVersion) {
        user.emit(ProxyEvent.SYSTEM_MESSAGE, {
          message: __(
            user.getLanguage(),
            "New version {{newVersion}} available!",
            { newVersion },
          ),
        });
      }
    }
  },
};
