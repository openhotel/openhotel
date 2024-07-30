import { proxy } from "system/proxy";
import { Event, global } from "@tulib/tulip";
import { isDevelopment } from "shared/utils";
import { game } from "system/game";
import { tasks } from "system/tasks";

export const System = (() => {
  const $proxy = proxy();
  const $game = game();

  const $tasks = tasks();

  const load = () => {
    $tasks.load();

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
    proxy: $proxy,
    game: $game,
    tasks: $tasks,

    load,
  };
})();
