import { application, global } from "@tu/tulip";
import { mainComponent } from "modules/main";
import { isDevelopment, loadLocale } from "shared/utils";
import { System } from "system";
import {
  FurnitureCollection,
  SpriteSheetEnum,
  TextureEnum,
} from "shared/enums";

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
  const spriteSheets = Object.values(SpriteSheetEnum);
  const furnitureCollectionSpriteSheets = Object.values(FurnitureCollection);

  await global.spriteSheets.load({
    spriteSheet: [...spriteSheets, ...furnitureCollectionSpriteSheets],
    onLoad: (label) => {
      console.info(`Spritesheet ${label} loaded!`);
    },
  });

  const textures = Object.values(TextureEnum);
  await global.textures.load({
    textures,
    onLoad: (label) => {
      console.info(`Texture ${label} loaded!`);
    },
  });

  await loadLocale();
  await System.load();

  app.add(mainComponent());
});
