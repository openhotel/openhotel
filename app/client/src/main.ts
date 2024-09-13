import { application } from "@tu/tulip";
import { System } from "system";

const app = application({
  backgroundColor: 0x030303,
  scale: 2,
  pixelPerfect: true,
  showFPS: false,
  //@ts-ignore
  importMetaEnv: import.meta.env,
  //@ts-ignore
  importMetaHot: import.meta.hot,
  safeArea: false,
});

app.load(async () => {
  await System.load();
});
