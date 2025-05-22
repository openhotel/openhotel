import { Command, CommandRoles } from "shared/types/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { isHexColor } from "shared/utils/hex.utils.ts";

export const colorCommand: Command = {
  command: "color",
  role: CommandRoles.USER,
  usages: ["<hexColor>", "<clear>"],
  description: "command.color.description",
  func: async ({ user, args }) => {
    if (!args.length) return;

    const [hex] = args as [string];

    if (hex === "clear") {
      await user.setColor(null);
      return user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: "Color cleared!",
      });
    }

    if (!isHexColor(hex + ""))
      return user.emit(ProxyEvent.SYSTEM_MESSAGE, {
        message: "Incorrect hexadecimal value!",
      });

    await user.setColor(parseInt(hex, 16));

    return user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: "New color set!",
    });
  },
};
