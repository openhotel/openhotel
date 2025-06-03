import { Command, CommandRoles } from "shared/types/main.ts";

export const clearCommand: Command = {
  command: "clear",
  usages: [""],
  role: CommandRoles.USER,
  description: "command.clear.description",
  func: async ({ user }) => {
    await user.moveAllFurnitureFromRoomToInventory();
  },
};
