import { parse, stringify } from "@std/yaml";
import { System } from "modules/system/main.ts";
import { GameMutable, GameType } from "shared/types/games.types.ts";
import { log } from "shared/utils/log.utils.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { UserMutable } from "shared/types/user.types.ts";
import { getParentProcessWorker } from "@oh/utils";

const PATH = "./assets/games";

export const games = () => {
  const $gameMap: Record<string, GameMutable> = {};
  const $gameWorkerMap: Record<string, any> = {};

  let $worker;

  const $getGame = (game: GameType): GameMutable => {
    let $usersJoined: string[] = [];
    let $usersReady: string[] = [];

    let $clientIdUserMap: Record<string, string> = {};

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
      if (
        $usersJoined.includes(user.getAccountId()) ||
        $usersReady.includes(user.getAccountId())
      )
        return;

      $usersJoined.push(user.getAccountId());
      console.log(
        `${user.getUsername()} joined game '${game.manifest.name}...'`,
      );

      $clientIdUserMap[clientId] = user.getAccountId();

      $worker.emit("USER_JOIN", {
        clientId,
        accountId: user.getAccountId(),
        username: user.getUsername(),
      });
    };

    const setUserReady = (user: UserMutable, clientId: string) => {
      //if user is already ready or user has not joined
      if (
        $usersReady.includes(user.getAccountId()) ||
        !$usersJoined.includes(user.getAccountId())
      )
        return;

      $usersJoined = $usersJoined.filter(
        (userId) => userId !== user.getAccountId(),
      );
      $usersReady.push(user.getAccountId());
      console.log(
        `${user.getUsername()} ready for game '${game.manifest.name}!'`,
      );

      $worker.emit("USER_READY", {
        clientId,
        accountId: user.getAccountId(),
      });
    };

    const removeUser = (user: UserMutable, clientId: string) => {
      $usersReady = $usersReady.filter(
        (userId) => userId !== user.getAccountId(),
      );
      $usersJoined = $usersJoined.filter(
        (userId) => userId !== user.getAccountId(),
      );
      delete $clientIdUserMap[clientId];

      console.log(`${user.getUsername()} left game '${game.manifest.name}'`);

      $worker.emit("USER_LEAVE", {
        clientId,
        accountId: user.getAccountId(),
      });
    };

    const getUser = ({ clientId }: { clientId: string }) => {
      if (clientId)
        return System.game.users.get({ accountId: $clientIdUserMap[clientId] });

      return null;
    };

    const emit = (event: string, message: any) => {
      $worker.emit(event, message);
    };

    return {
      getPath,
      getExecutable,
      getManifest,

      addUserRequest,
      addUser,
      setUserReady,
      removeUser,

      getUser,

      emit,
    };
  };

  const add = (game: GameType) => {
    $gameMap[game.manifest.id] = $getGame(game);

    log(`Game '${game.manifest.name}' [${game.manifest.id}] starting...`);

    $worker = getParentProcessWorker(`${game.path}/${game.executable}`, []);
    $gameWorkerMap[game.manifest.id] = $worker;

    $worker.on("USER_DATA", ({ clientId, event, message }) => {
      System.proxy.$emit(ProxyEvent.$GAME_USER_DATA, {
        gameId: game.manifest.id,
        clientId,
        event,
        message,
      });
    });
    $worker.on("DISCONNECT_USER", ({ clientId }) => {
      System.proxy.$emit(ProxyEvent.$GAME_USER_DISCONNECT, {
        gameId: game.manifest.id,
        clientId,
      });
    });

    $worker.on("PONG", () => {
      setTimeout(() => {
        $worker.emit("PING", { d: performance.now() });
      }, 1000);
    });

    $worker.emit("PING", { d: performance.now() });
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
