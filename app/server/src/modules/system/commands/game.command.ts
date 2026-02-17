import { Command, CommandRoles, UserMutable } from "shared/types/main.ts";
import { System } from "modules/system/main.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { getRandomString } from "@oh/utils";

const list = async (_: string[], user: UserMutable) => {
  const gameDataList = await Promise.all(
    System.game.games.getGames().map(async (game) => ({
      gameId: game.getGameId(),
      ...(await game.getSettings()),
    })),
  );
  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: `Available games: ${gameDataList.map((game) => game.name)}`,
  });
};

const join = async ([_, ...nameArray]: string[], user: UserMutable) => {
  const gameName = nameArray.join(" ");
  const foundGameSettings = (
    await Promise.all(
      System.game.games.getGames().map(async (game) => ({
        ...(await game.getSettings()),
        gameId: game.getGameId(),
      })),
    )
  ).find((game) => game.name === gameName);

  if (!foundGameSettings) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `Game ${gameName} now found!`,
    });
    return;
  }

  const foundGame = System.game.games.getGame(foundGameSettings.gameId);

  if (!foundGame) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `Something went wrong!`,
    });
    return;
  }
  const token = getRandomString(16);
  if (!foundGame.addUserRequest(user, token)) return;

  const settings = await foundGame.getSettings();

  user.emit(ProxyEvent.LOAD_GAME, {
    gameId: foundGame.getGameId(),
    name: settings.name,
    token,
    properties: {
      screen: settings.screen,
      windowSize: settings.windowSize,
    },
  });
};

const add = async ([_, repo, type = "repo"]: string[], user: UserMutable) => {
  if (!repo) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `Usage: /game add <repo/path> [type] (type: "repo" or "path")`,
    });
    return;
  }

  const result = await System.game.games.add(repo, type as "repo" | "path");

  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: result.message,
  });
};

const remove = async ([_, repo]: string[], user: UserMutable) => {
  if (!repo) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `Usage: /game remove <repo/path>`,
    });
    return;
  }

  const result = await System.game.games.remove(repo);

  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: result.message,
  });
};

const disable = async ([_, repo]: string[], user: UserMutable) => {
  if (!repo) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `Usage: /game disable <repo/path>`,
    });
    return;
  }

  const result = await System.game.games.disable(repo);

  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: result.message,
  });
};

const enable = async ([_, repo]: string[], user: UserMutable) => {
  if (!repo) {
    user.emit(ProxyEvent.SYSTEM_MESSAGE, {
      message: `Usage: /game enable <repo/path>`,
    });
    return;
  }

  const result = await System.game.games.enable(repo);

  user.emit(ProxyEvent.SYSTEM_MESSAGE, {
    message: result.message,
  });
};

export const gameCommand: Command = {
  command: "game",
  role: CommandRoles.USER,
  description: "command.game.description",
  func: async ({ user, args }) => {
    const action = args[0];
    if (!action) return;

    const isOp = await user.isOp();

    const command = {
      list,
      join,
      ...(isOp ? { add, remove, disable, enable } : {}),
    }[action];

    if (!command) return;

    await command(args as string[], user);
  },
};
