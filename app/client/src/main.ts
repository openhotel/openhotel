import { application } from "@tulib/tulip";
import { mainComponent } from "modules/main";
import { isDevelopment } from "shared/utils";
import { System } from "system";

const app = application({
  backgroundColor: 0x030303,
  scale: 2,
  pixelPerfect: true,
  showFPS: isDevelopment(),
  //@ts-ignore
  importMetaEnv: import.meta.env,
  //@ts-ignore
  importMetaHot: import.meta.hot,
});

System.load();
app.load(async () => {
  app.add(mainComponent());
});
