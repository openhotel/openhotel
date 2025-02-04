import { proxy } from "system/proxy";
import { Event, global } from "@tu/tulip";
import { game } from "system/game";
import { tasks } from "system/tasks";
import { events } from "./events";
import { textures } from "system/textures";
import { locale } from "system/locale";
import { loader } from "system/loader";
import { api } from "system/api";
import { $window } from "system/window";
import { config } from "system/config";
import { contributors } from "system/contributors";
import { mainComponent } from "modules/main";

export const System = (() => {
  const $config = config();
  const $locale = locale();
  const $loader = loader();
  const $textures = textures();
  const $proxy = proxy();
  const $game = game();
  const $events = events();
  const $api = api();
  const $contributors = contributors();

  const $tasks = tasks();
  const $$window = $window();

  const load = async () => {
    await $config.load();

    await $config.load();
    $$window.load();

    await $textures.loadText();
    $loader.start();

    if (!(await $proxy.preConnect())) return;

    await $contributors.load();

    await $locale.load();
    await $textures.load();
    $tasks.load();
    await $game.load();

    await $proxy.connect();

    $loader.end();
    global.getApplication().add(mainComponent());

    global.events.on(Event.KEY_DOWN, ({ ctrlKey, key }) => {
      const lowerCaseKey = key.toLowerCase();
      if ($config.isDevelopment()) {
        switch (lowerCaseKey) {
          case "f5":
            window.location.reload();
            break;
          case "r":
            if (ctrlKey) window.location.reload();
            break;
        }
      }
      switch (lowerCaseKey) {
        case "f11":
          document.body.requestFullscreen();
          break;
      }
    });
  };

  return {
    locale: $locale,
    loader: $loader,
    proxy: $proxy,
    game: $game,
    tasks: $tasks,
    events: $events,
    api: $api,
    config: $config,
    contributors: $contributors,

    load,
  };
})();
