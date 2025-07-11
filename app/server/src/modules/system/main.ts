import { Envs } from "shared/types/main.ts";
import { proxy } from "./proxy/main.ts";
import { phantom } from "./phantom/main.ts";
import { game } from "./game/main.ts";
import { initLog, log } from "shared/utils/main.ts";
import { tasks } from "./tasks.ts";
import { getDb, DbMutable, getRandomString } from "@oh/utils";
import { onet } from "./onet/main.ts";
import { auth } from "modules/shared/auth.ts";
import { config } from "./config.ts";
import { Migrations } from "../migrations/main.ts";
import { image } from "modules/shared/image.ts";
import { updater } from "modules/system/updater.ts";

export const System = (() => {
  let $envs: Envs;

  const $token = getRandomString(16);

  const $proxy = proxy();
  const $phantom = phantom();
  const $tasks = tasks();
  const $game = game();
  const $db: DbMutable = getDb({ pathname: `./server-database` });
  const $onet = onet();
  const $auth = auth();
  const $config = config();
  const $image = image();
  const $updater = updater();

  const load = async (envs: Envs) => {
    console.clear();

    $envs = envs;

    await $config.load(envs);
    const isDevelopment = $envs.version === "development";

    await $updater.load();

    if (isDevelopment)
      console.log(
        "\n\n    ------------------\n    DEVELOPMENT SERVER\n    ------------------\n\n",
      );
    initLog();

    // -> Load proxy

    log("server");

    const config = $config.get();

    await $image.load();
    await $auth.load(config, true);
    $proxy.load();
    await $db.load();
    await Migrations.load($db);
    await $game.load();
    $tasks.load();
    await $onet.load();

    if (config.phantom.enabled) $phantom.load();
  };

  const getEnvs = () => $envs;

  const getToken = () => $token;
  const isTokenValid = (token: string) => $token === token;
  // || $config.isDevelopment();

  return {
    load,

    getEnvs,

    getToken,
    isTokenValid,

    game: $game,
    proxy: $proxy,
    phantom: $phantom,
    tasks: $tasks,
    db: $db,
    onet: $onet,
    auth: $auth,
    config: $config,
    image: $image,
  };
})();
