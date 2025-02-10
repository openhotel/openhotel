import { Command, CommandRoles } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export const teleportCommand: Command = {
  command: "teleport",
  role: CommandRoles.OP,
  usages: [
    "link <teleportIdA> <teleportIdB>",
    "remote <teleportId>",
    "remote <teleportId> <linkId>",
  ],
  description: "command.teleport.description",
  func: async ({ user, args }) => {
    const [type, ...moreArgs] = args as string[];

    const [teleportIdA, teleportIdB] = moreArgs as string[];
    const teleportA = System.game.teleports.get(teleportIdA);
    if (!teleportA) return;

    switch (type) {
      case "link":
        const teleportB = System.game.teleports.get(teleportIdB);
        if (!teleportB) return;

        await System.game.teleports.setLink(teleportIdA, teleportIdB);
        break;
      case "remote":
        if (!System.config.get().onet.enabled) return;

        const [, $linkId] = moreArgs as string[];

        const { linkId } = await System.game.teleports.remote.setLink(
          user.getAccountId(),
          user.getRoom(),
          teleportIdA,
          $linkId ?? undefined,
        );

        user.emit(ProxyEvent.SYSTEM_MESSAGE, {
          message: `link id on console... (${linkId})`,
        });
        break;
    }
  },
};
