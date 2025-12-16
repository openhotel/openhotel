import { Command, CommandRoles, UserMutable } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { getRandomString } from "@oh/utils";

const list = async (_: string[], user: UserMutable) => {
  const gameDataList = await Promise.all(
    System.game.games.getGames().map(async (game) => ({
      gameId: game.getGameId(),
      ...(await game.getConfig()),
    })),
  );
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: `Available games: ${gameDataList.map((game) => game.name)}`,
  });
  console.log(gameDataList);
};

const join = async ([_, ...nameArray]: string[], user: UserMutable) => {
  const gameName = nameArray.join(" ");
  const foundGameConfig = (
    await Promise.all(
      System.game.games.getGames().map(async (game) => ({
        ...(await game.getConfig()),
        gameId: game.getGameId(),
      })),
    )
  ).find((game) => game.name === gameName);

  if (!foundGameConfig) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `Game ${gameName} now found!`,
    });
    return;
  }

  const foundGame = System.game.games.getGame(foundGameConfig.gameId);

  if (!foundGame) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `Something went wrong!`,
    });
    return;
  }
  const token = getRandomString(16);
  if (!foundGame.addUserRequest(user, token)) return;

  const config = await foundGame.getConfig();

  user.emit(ProxyEvent.LOAD_GAME, {
    gameId: foundGame.getGameId(),
    name: config.name,
    token,
    properties: {
      screen: "windowed",
      windowSize: config.windowSize,
    },
  });
};

export const gameCommand: Command = {
  command: "game",
  role: CommandRoles.USER,
  description: "command.game.description",
  func: async ({ user, args }) => {
    const action = args[0];
    if (!action) return;

    const command = {
      list,
      join,
    }[action];

    if (!command) return;

    await command(args as string[], user);
  },
};
