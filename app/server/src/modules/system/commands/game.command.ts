import { Command, CommandRoles } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";

export const gameCommand: Command = {
  command: "game",
  usages: [""],
  role: CommandRoles.USER,
  description: "command.game.description",
  func: async ({ user }) => {
    const game = System.game.games.getGames()[0];

    user.emit(ProxyEvent.LOAD_GAME, {
      gameId: game.manifest.id,
      token: System.game.games.getToken(),
    });
  },
};
