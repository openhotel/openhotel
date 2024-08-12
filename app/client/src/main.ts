import { application } from "@tu/tulip";
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

app.load(async () => {
  await System.load();
});
