import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { System } from "modules/system/main.ts";
import { TransactionType } from "shared/enums/economy.enum.ts";
import { getTextFromArgs } from "shared/utils/args.utils.ts";

export const creditsCommand: Command = {
  command: "credits",
  role: CommandRoles.OP,
  usages: ["<username> <amount>"],
  description: "command.credits.description",
  func: async ({ user, args }) => {
    if (!args.length) return;

    const [username, amount] = args as [string, number];

    const targetUser = System.game.users.get({ username });
    if (!targetUser || isNaN(amount)) return;

    const { success } = await System.game.economy.executeTransaction({
      type: TransactionType.REWARD,
      amount,
      description: `motherlode`,
      toAccount: targetUser.getAccountId(),
    });

    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: success
        ? getTextFromArgs(
            "{{amount}} credits transferred to {{username}} successfully!",
            {
              username,
              amount,
            },
          )
        : "Transaction cannot be processed!",
    });
  },
};
