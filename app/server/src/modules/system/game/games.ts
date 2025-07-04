import { parse, stringify } from "@std/yaml";
import { System } from "modules/system/main.ts";
import { GameMutable, GameType } from "shared/types/games.types.ts";
import { log } from "shared/utils/log.utils.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { UserMutable } from "shared/types/user.types.ts";

const PATH = "./assets/games";

export const games = () => {
  const $gameMap: Record<string, GameMutable> = {};

  const $getGame = (game: GameType): GameMutable => {
    const getPath = () => game.path;
    const getExecutable = () => game.executable;
    const getManifest = () => game.manifest;

    const addUserRequest = (user: UserMutable, token: string) => {
      System.proxy.$emit(ProxyEvent.$GAME_USER_REQUEST, {
        gameId: getManifest().id,
        accountId: user.getAccountId(),
        ip: user.getIp(),
        token,
      });
    };

    return {
      getPath,
      getExecutable,
      getManifest,

      addUserRequest,
    };
  };

  const add = (game: GameType) => {
    $gameMap[game.manifest.id] = $getGame(game);

    log(`Game '${game.manifest.name}' [${game.manifest.id}] starting...`);

    const args = [
      `--internalProxyPort=${System.internalProxy.getPort()}`,
      `--token=${System.internalProxy.getToken()}`,
      "--preventUpdate",
      "--debug",
    ];

    const cmd = new Deno.Command(`${game.path}/${game.executable}`, {
      args,
    });
    cmd.spawn();
  };

  const load = async () => {
    for await (const game of await Deno.readDir(PATH)) {
      if (game.isFile) continue;

      let gamePath = `${PATH}/${game.name}`;
      let hasManifest = false;
      let executable = null;

      for await (const gameFile of await Deno.readDir(gamePath)) {
        if (gameFile.name === "manifest.yml") hasManifest = true;
        if (gameFile.name.startsWith("server_")) executable = gameFile.name;
      }

      if (hasManifest && executable) {
        const manifest = parse(
          await Deno.readTextFile(`${gamePath}/manifest.yml`),
        );
        add({
          path: gamePath,
          executable,
          manifest,
        });
      }
    }

    await Deno.writeTextFile(
      PATH + "/games.yml",
      stringify(
        getGames().reduce(
          (games, game) => ({
            ...games,
            [game.getManifest().id]:
              `${game.getPath()}${game.getManifest().client.path}`,
          }),
          {},
        ),
      ),
    );
  };

  const getGames = (): GameMutable[] => Object.values($gameMap);
  const getGame = (gameId: string): GameMutable | null => $gameMap[gameId];

  return {
    load,

    getGames,
    getGame,
  };
};
