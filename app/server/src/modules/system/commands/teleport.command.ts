import { Command } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { __ } from "shared/utils/languages.utils.ts";

export const teleportCommand: Command = {
  command: "teleport",
  func: async ({ user, args }) => {
    const [type, ...moreArgs] = args as string[];
    const room = await System.game.rooms.get(user.getRoom());

    const [teleportId] = moreArgs as string[];
    const furniture = room.getFurnitures();
    const teleport = furniture.find((furni) => furni.uid === teleportId);
    if (!teleport) return;

    switch (type) {
      case "link":
        await System.game.teleports.setLink(teleportId);
        break;
      case "remote":
        if (!System.getConfig().onet.enabled) return;

        const [, $linkId] = moreArgs as string[];

        const { linkId } = await System.game.teleports.remote.setLink(
          user.getAccountId(),
          user.getRoom(),
          teleportId,
          $linkId ?? undefined,
        );

        user.emit(ProxyEvent.SYSTEM_MESSAGE, {
          message: `link id on console... (${linkId})`,
        });
        break;
    }
  },
};
