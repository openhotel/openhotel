import { parse, stringify } from "@std/yaml";
import { getRandomString } from "@oh/utils";
import { System } from "modules/system/main.ts";
import { GameType } from "shared/types/games.types.ts";
import { log } from "shared/utils/log.utils.ts";

const PATH = "./assets/games";

export const games = () => {
  let $games: GameType[] = [];

  const token = getRandomString(16);

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
        $games.push({
          path: gamePath,
          executable,
          manifest,
        });
      }
    }

    await Deno.writeTextFile(
      PATH + "/games.yml",
      stringify(
        $games.reduce(
          (games, game) => ({
            ...games,
            [game.manifest.id]: `${game.path}${game.manifest.client.path}`,
          }),
          {},
        ),
      ),
    );

    for (const game of $games) {
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
    }
  };

  const getToken = () => token;

  const getGames = (): GameType[] => $games;
  const getGame = (gameId: string): GameType | null =>
    $games.find((game) => game.manifest.id === gameId);

  return {
    load,

    getGames,
    getGame,

    getToken,
  };
};
