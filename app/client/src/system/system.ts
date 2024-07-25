import { proxy } from "system/proxy";
import { Event, global } from "@tulib/tulip";
import { isDevelopment } from "shared/utils";

export const System = (() => {
  const $proxy = proxy();

  global.events.on(Event.KEY_DOWN, ({ ctrlKey, key }) => {
    if (isDevelopment()) {
      switch (key.toLowerCase()) {
        case "f5":
          window.location.reload();
          break;
        case "r":
          if (ctrlKey) window.location.reload();
          break;
      }
    }
  });

  return {
    proxy: $proxy,
  };
})();
