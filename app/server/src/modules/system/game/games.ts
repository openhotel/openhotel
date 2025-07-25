import { parse, stringify } from "@std/yaml";
import { System } from "modules/system/main.ts";
import { GameMutable, GameType } from "shared/types/games.types.ts";
import { log } from "shared/utils/log.utils.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { UserMutable } from "shared/types/user.types.ts";
import { getParentProcessWorker } from "./parent-process-worker.ts";
// import { getParentProcessWorker } from "@oh/utils";

const PATH = "./assets/games";

export const games = () => {
  const $gameMap: Record<string, GameMutable> = {};
  const $gameWorkerMap: Record<string, any> = {};

  let $worker;

  const $getGame = (game: GameType): GameMutable => {
    let $users: string[] = [];

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

    const addUser = (user: UserMutable, clientId: string) => {
      if ($users.includes(user.getAccountId())) return;

      $users.push(user.getAccountId());
      console.log(`${user.getUsername()} joined game '${game.manifest.name}'`);

      $worker.emit("USER_READY", {
        clientId,
        accountId: user.getAccountId(),
      });
    };

    const removeUser = (user: UserMutable, clientId: string) => {
      $users = $users.filter((userId) => userId !== user.getAccountId());
      console.log(`${user.getUsername()} left game '${game.manifest.name}'`);

      $worker.emit("USER_LEAVE", {
        clientId,
        accountId: user.getAccountId(),
      });
    };

    const emit = (event: string, message: any) => {
      console.log("game", event, message);
      $worker.emit(event, message);
    };

    return {
      getPath,
      getExecutable,
      getManifest,

      addUserRequest,
      addUser,
      removeUser,

      emit,
    };
  };

  const add = (game: GameType) => {
    $gameMap[game.manifest.id] = $getGame(game);

    log(`Game '${game.manifest.name}' [${game.manifest.id}] starting...`);

    $worker = getParentProcessWorker(`${game.path}/${game.executable}`, []);
    $gameWorkerMap[game.manifest.id] = $worker;

    $worker.on("test", (data) => {
      console.log("test", data);
      // Development.proxy.getClient(clientId).emit(event, message);
    });
    $worker.on("USER_DATA", ({ clientId, event, message }) => {
      console.log("USER_DATA", clientId, event, message);
      // Development.proxy.getClient(clientId).emit(event, message);
    });
    $worker.on("DISCONNECT_USER", ({ clientId }) => {
      console.log("DISCONNECT_USER", clientId);
      // Development.proxy.getClient(clientId)?.close();
    });
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
