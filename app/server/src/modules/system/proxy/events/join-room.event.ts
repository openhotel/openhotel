import { ProxyEventType } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/main.ts";
import { System } from "modules/system/main.ts";
import { __ } from "shared/utils/main.ts";
import { getLatestVersion } from "@oh/utils";

export const joinRoomEvent: ProxyEventType<{ roomId: string }> = {
  event: ProxyEvent.JOIN_ROOM,
  func: async ({ data: { roomId }, user }) => {
    user.setLastMessage('');

    await user.moveToRoom(roomId);

    const { version: configVersion } = System.config.get();
    if (configVersion === "development") return;

    if (!(await user.isOp())) return;

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
