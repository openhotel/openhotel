import { application, global } from "@tulib/tulip";
import { mainComponent } from "modules/main";
import { isDevelopment, loadLocale } from "shared/utils";
import { System } from "system";
import { SpriteSheetEnum, TextureEnum } from "shared/enums";

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
  const spriteSheets = Object.values(SpriteSheetEnum);
  const textures = Object.values(TextureEnum);
  await global.spriteSheets.load(...spriteSheets);
  await global.textures.load(...textures);
  await loadLocale();

  app.add(mainComponent());
});
