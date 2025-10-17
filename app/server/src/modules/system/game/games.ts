import { parse, stringify } from "@std/yaml";
import { System } from "modules/system/main.ts";
import { GameMutable, GameType } from "shared/types/games.types.ts";
import { log } from "shared/utils/log.utils.ts";
import { ProxyEvent } from "shared/enums/event.enum.ts";
import { UserMutable } from "shared/types/user.types.ts";
import {
  getParentProcessWorker,
  getOSName,
  getPath,
  getTemporalUpdateFilePathname,
} from "@oh/utils";
import { TransactionType } from "shared/enums/economy.enum.ts";
import * as path from "@std/path";
import { ulid } from "@std/ulid";

const GAMES_PATH_FILE = "./assets/games.yml";
const PATH = ".games";

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
    const getGameId = () => game.gameId;

    const addUserRequest = (user: UserMutable, token: string): boolean => {
      if (
        $usersJoined.includes(user.getAccountId()) ||
        $usersReady.includes(user.getAccountId())
      )
        return false;

      System.proxy.$emit(ProxyEvent.$GAME_USER_REQUEST, {
        gameId: getGameId(),
        accountId: user.getAccountId(),
        ip: user.getIp(),
        token,
      });
      return true;
    };

    const addUser = (user: UserMutable, clientId: string) => {
      if (
        $usersJoined.includes(user.getAccountId()) ||
        $usersReady.includes(user.getAccountId())
      )
        return;

      $usersJoined.push(user.getAccountId());
      console.log(`${user.getUsername()} joined game '${game.name}...'`);

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
      console.log(`${user.getUsername()} ready for game '${game.name}!'`);

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

      console.log(`${user.getUsername()} left game '${game.name}'`);

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

    const getConfig = async () =>
      parse(await Deno.readTextFile(`${game.path}/config.yml`));

    const emit = (event: string, message: any) => {
      $worker.emit(event, message);
    };

    return {
      getPath,
      getExecutable,
      getGameId,

      addUserRequest,
      addUser,
      setUserReady,
      removeUser,

      getUser,

      getConfig,

      emit,
    };
  };

  const add = (game: GameType) => {
    let $game = ($gameMap[game.gameId] = $getGame(game));

    log(`Game '${game.name}' starting...`);

    $worker = getParentProcessWorker(`${game.path}/${game.executable}`, [], {
      prefixLog: `[${game.name}]: `,
    });
    $gameWorkerMap[game.gameId] = $worker;

    $worker.on("USER_DATA", ({ clientId, event, message }) => {
      System.proxy.$emit(ProxyEvent.$GAME_USER_DATA, {
        gameId: game.gameId,
        clientId,
        event,
        message,
      });
    });
    $worker.on("DISCONNECT_USER", ({ clientId }) => {
      System.proxy.$emit(ProxyEvent.$GAME_USER_DISCONNECT, {
        gameId: game.gameId,
        clientId,
      });
    });
    $worker.on("USER_REWARD", ({ clientId, amount }) => {
      System.game.economy.executeTransaction({
        type: TransactionType.REWARD,
        description: `Game '${game.name}' reward`,
        amount,
        toAccount: $game.getUser({ clientId }).getAccountId(),
      });
    });

    $worker.on("PONG", () => {
      setTimeout(() => {
        $worker.emit("PING", { d: performance.now() });
      }, 1000);
    });

    $worker.emit("PING", { d: performance.now() });
  };

  const $downloadGame = async (name: string, gameId: string) => {
    const osName = getOSName();
    let arch: "x86_64" | "aarch64" | null = Deno.build.arch;
    if (arch !== "aarch64" || osName !== "linux") arch = null;

    const $headers = new Headers();

    $headers.append("X-GitHub-Api-Version", `2022-11-28`);
    $headers.append("Accept", `application/json`);
    $headers.append(
      "User-Agent",
      `Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0`,
    );
    $headers.append("Accept-Encoding", `br, deflate, gzip, x-gzip`);

    const { assets } = await fetch(
      `https://api.github.com/repos/${name}/releases/latest`,
      {
        headers: $headers,
      },
    ).then((data) => data.json());

    const osAsset = assets.find(
      ({ name }) =>
        name.includes(osName) && (arch === null || name.includes(arch)),
    );

    $headers.set("Accept", "application/octet-stream");
    const buildAsset = await fetch(osAsset.url, {
      headers: $headers,
    });

    const isDevelopment = System.config.isDevelopment();

    const dirPath = path.join(
      isDevelopment ? Deno.cwd() : getPath(),
      `${PATH}/${name}`,
    );
    const updateFilePath = getTemporalUpdateFilePathname(dirPath);
    const updateFile = path.join(dirPath, `update_${osAsset.name}`);
    const updatedFile = path.join(dirPath, osAsset.name);

    await Deno.mkdir(path.dirname(updateFile), { recursive: true });

    await Deno.writeFile(
      updateFile,
      new Uint8Array(await buildAsset.arrayBuffer()),
      {
        mode: 0x777,
      },
    );
    await Deno.chmod(updateFile, 0o777);

    try {
      await Deno.remove(updateFilePath);
    } catch (e) {}

    const bash = osAsset.name.includes(".zip")
      ? `#! /bin/bash
            unzip -o '${updateFile}' -d '${dirPath}'
            chmod -R 777 ${dirPath}
          `
      : `#! /bin/bash
            touch '${updatedFile}' && rm '${updatedFile}'
            mv '${updateFile}' '${updatedFile}'
            chmod -R 777 ${updatedFile}
          `;

    await Deno.writeTextFile(updateFilePath, bash, {
      mode: 0o0777,
      create: true,
    });

    const command = new Deno.Command("sh", {
      args: [updateFilePath],
      stdin: "null",
      stdout: "null",
      stderr: "null",
    });

    const process = command.spawn();
    await process.status;
  };

  const load = async () => {
    const { games } = parse(await Deno.readTextFile(GAMES_PATH_FILE));
    const osName = getOSName();

    let gameDataMap = {};

    try {
      gameDataMap = parse(
        await Deno.readTextFile(path.join(PATH, "games.yml")),
      );
    } catch (e) {}
    if (!gameDataMap) gameDataMap = {};

    for (const { name } of games) {
      let gameId = Object.values(gameDataMap).find(
        (data: any) => data?.name === name,
      )?.gameId;

      // download first time
      if (!gameId) {
        gameId = ulid();
        await $downloadGame(name, gameId);
      }

      gameDataMap[gameId] = {
        gameId,
        name,
      };

      let isDone = false;
      do {
        try {
          add({
            path: `${PATH}/${name}`,
            executable: `game_${osName}`,
            gameId,
            name,
          });
          isDone = true;
        } catch (e) {
          await $downloadGame(name, gameId);
        }
      } while (!isDone);
    }

    Deno.writeTextFileSync(
      path.join(PATH, "games.yml"),
      stringify(gameDataMap),
    );

    // await System.db.set(["games", ulid()], roomId);

    // for await (const game of await Deno.readDir(PATH)) {
    //   if (game.isFile) continue;
    //
    //   let gamePath = `${PATH}/${game.name}`;
    //   let hasManifest = false;
    //   let executable = null;
    //
    //   for await (const gameFile of await Deno.readDir(gamePath)) {
    //     if (gameFile.name === "manifest.yml") hasManifest = true;
    //     if (gameFile.name.startsWith("server_")) executable = gameFile.name;
    //   }
    //
    //   if (hasManifest && executable) {
    //     const manifest = parse(
    //       await Deno.readTextFile(`${gamePath}/manifest.yml`),
    //     );
    //     add({
    //       path: gamePath,
    //       executable,
    //       manifest,
    //     });
    //   }
    // }
    //
    // await Deno.writeTextFile(
    //   PATH + "/games.yml",
    //   stringify(
    //     getGames().reduce(
    //       (games, game) => ({
    //         ...games,
    //         [game.getManifest().id]:
    //           `${game.getPath()}${game.getManifest().client.path}`,
    //       }),
    //       {},
    //     ),
    //   ),
    // );
  };

  const getGames = (): GameMutable[] => Object.values($gameMap);
  const getGame = (gameId: string): GameMutable | null => $gameMap[gameId];

  return {
    load,

    getGames,
    getGame,
  };
};
