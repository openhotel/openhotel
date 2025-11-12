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

    const addUser = (user: UserMutable) => {
      if (
        $usersJoined.includes(user.getAccountId()) ||
        $usersReady.includes(user.getAccountId())
      )
        return;

      $usersJoined.push(user.getAccountId());
      console.log(`${user.getUsername()} joined game '${game.repo}...'`);

      $clientIdUserMap[user.getGameClientId()] = user.getAccountId();

      $worker.emit("USER_JOIN", {
        clientId: user.getGameClientId(),
        accountId: user.getAccountId(),
        username: user.getUsername(),
      });
    };

    const setUserReady = (user: UserMutable) => {
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
      console.log(`${user.getUsername()} ready for game '${game.repo}!'`);

      $worker.emit("USER_READY", {
        clientId: user.getGameClientId(),
        accountId: user.getAccountId(),
      });
    };

    const removeUser = (user: UserMutable) => {
      $usersReady = $usersReady.filter(
        (userId) => userId !== user.getAccountId(),
      );
      $usersJoined = $usersJoined.filter(
        (userId) => userId !== user.getAccountId(),
      );
      delete $clientIdUserMap[user.getGameClientId()];

      console.log(`${user.getUsername()} left game '${game.repo}'`);

      $worker.emit("USER_LEAVE", {
        clientId: user.getGameClientId(),
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

    log(`>> Game '${game.repo}' starting...`);

    $worker = getParentProcessWorker(`${game.path}/${game.executable}`, [], {
      prefixLog: `[${game.repo}]: `,
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
    $worker.on("USER_REWARD", ({ clientId, amount, ...props }) => {
      System.game.economy.executeTransaction({
        type: TransactionType.REWARD,
        description: `Game '${game.repo}' reward`,
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

  const $downloadGame = async (repo: string, gameId: string) => {
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
      `https://api.github.com/repos/${repo}/releases/latest`,
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
      `${PATH}/${repo}`,
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
    log("> Loading games...");

    const { games } = parse(await Deno.readTextFile(GAMES_PATH_FILE));
    const osName = getOSName();

    let gameDataMap = {};

    try {
      gameDataMap = parse(
        await Deno.readTextFile(path.join(PATH, "games.yml")),
      );
    } catch (e) {}
    if (!gameDataMap) gameDataMap = {};

    for (const { repo, path } of games) {
      let gameId = path
        ? ulid()
        : Object.values(gameDataMap).find((data: any) => data?.repo === repo)
            ?.gameId;

      const isLocal = Boolean(path);

      // download first time
      if (!gameId) {
        gameId = ulid();
        await $downloadGame(repo, gameId);
      }

      gameDataMap[gameId] = {
        gameId,
        repo,
      };

      let isDone = false;
      do {
        try {
          add({
            path: `${PATH}/${repo ?? path}`,
            executable: `game_${osName}`,
            gameId,
            repo: repo ?? path,
            isLocal,
          });
          isDone = true;
        } catch (e) {
          if (isLocal) {
            console.error(`>> Game '${path}' doesn't exist!`);
            return;
          }
          await $downloadGame(repo, gameId);
        }
      } while (!isDone);
    }

    Deno.writeTextFileSync(
      path.join(PATH, "games.yml"),
      stringify(gameDataMap),
    );

    log("> Games loaded!");
  };

  const getGames = (): GameMutable[] => Object.values($gameMap);
  const getGame = (gameId: string): GameMutable | null => $gameMap[gameId];

  return {
    load,

    getGames,
    getGame,
  };
};
