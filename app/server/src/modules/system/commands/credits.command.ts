import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";
import { TransactionType } from "shared/enums/economy.enum.ts";

export const creditsCommand: Command = {
  command: "credits",
  role: CommandRoles.OP,
  usages: ["<amount> <username>"],
  description: "command.credits.description",
  func: async ({ user, args }) => {
    if (!args.length) return;

    const [username, amount] = args as [string, number];

    const targetUser = System.game.users.get({ username });
    if (!targetUser || isNaN(amount)) return;

    const { success } = await System.game.economy.executeTransaction({
      type: TransactionType.TRANSFER,
      amount,
      description: `${user.getUsername()} giving credits to`,
      toAccount: targetUser.getAccountId(),
    });
    const roomId = user.getRoom();
    if (!roomId) return;
    const room = await System.game.rooms.get(roomId);
    const y = room.getYFromPoint({ x, z }) ?? 0;

    user.setPosition({ x, z });

    room?.emit(ProxyEvent.SET_POSITION_HUMAN, {
      accountId: user.getAccountId(),
      position: { x, z, y },
    });
  },
};
