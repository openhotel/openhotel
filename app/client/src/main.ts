import { application } from "@tulib/tulip";
import { mainComponent } from "modules/main";

const app = application({
  backgroundColor: 0x030303,
  scale: 2,
  pixelPerfect: true,
  showFPS: true,
  //@ts-ignore
  importMetaEnv: import.meta.env,
  //@ts-ignore
  importMetaHot: import.meta.hot,
});

app.load(async () => {
  app.add(await mainComponent());
});
