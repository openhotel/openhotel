import { proxy } from "system/proxy";
import { Event, global } from "@tu/tulip";
import { isDevelopment } from "shared/utils";
import { game } from "system/game";
import { tasks } from "system/tasks";
import { events } from "./events";
import { textures } from "system/textures";
import { locale } from "system/locale";
import { loader } from "system/loader";

export const System = (() => {
  const $locale = locale();
  const $loader = loader();
  const $textures = textures();
  const $proxy = proxy();
  const $game = game();
  const $events = events();

  const $tasks = tasks();

  const load = async () => {
    await $textures.loadText();
    $loader.start();

    await $proxy.preConnect();

    await $locale.load();
    await $textures.load();
    $tasks.load();
    await $game.load();

    await $proxy.connect();
    $loader.end();

    global.events.on(Event.KEY_DOWN, ({ ctrlKey, key }) => {
      const lowerCaseKey = key.toLowerCase();
      if (isDevelopment()) {
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

    load,
  };
})();
