import { SpriteSheetEnum, TextureEnum } from "shared/enums";
import { global } from "@tu/tulip";
import { System } from "system/system";

export const textures = () => {
  const textSpriteSheets = [SpriteSheetEnum.DEFAULT_FONT];

  const loadText = async () => {
    await global.spriteSheets.load({
      spriteSheet: textSpriteSheets,
      onLoad: async (label) => {
        console.info(`Spritesheet ${label} loaded!`);
      },
    });
  };

  const load = async () => {
    const spriteSheets = Object.values(SpriteSheetEnum).filter(
      (spriteSheet) => !textSpriteSheets.includes(spriteSheet),
    );

    const spriteSheetsLoader = System.loader.addItems({
      items: spriteSheets.map((spriteSheet) =>
        spriteSheet.replace(".json", ""),
      ),
      startLabel: "Loading sprite-sheets",
      endLabel: "Sprite-sheets loaded!",
      prefix: "Loading",
      suffix: "sprite-sheet",
    });
    await global.spriteSheets.load({
      spriteSheet: spriteSheets,
      onLoad: async (label) => {
        spriteSheetsLoader.resolve(label.replace(".json", ""));
      },
    });

    const textures = Object.values(TextureEnum);
    const texturesLoader = System.loader.addItems({
      items: textures.map((spriteSheet) => spriteSheet.replace(".png", "")),
      startLabel: "Loading textures",
      endLabel: "Textures loaded!",
      prefix: "Loading",
      suffix: "texture",
    });
    await global.textures.load({
      textures,
      onLoad: async (label) => {
        texturesLoader.resolve(label.replace(".png", ""));
      },
    });
  };

  return {
    loadText,
    load,
  };
};
