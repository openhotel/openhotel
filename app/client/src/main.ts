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
  // TODO: load spritesheets & textures https://github.com/openhotel/openhotel/issues/191
  // const spriteSheets = Object.values(SpriteSheetEnum);
  // const textures = Object.values(TextureEnum);
  // await global.spriteSheets.load(...spriteSheets);
  // await global.textures.load(...textures);

  app.add(mainComponent());
});
