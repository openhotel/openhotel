import {
  CrossDirectionKeys,
  FurnitureData,
  FurnitureDirectionDataMap,
} from "shared/types";
import { global } from "@tu/tulip";
import { System } from "system/system";
import { CrossDirection, SystemEvent } from "shared/enums";

export const furniture = () => {
  const $furnitureMap: Record<string, FurnitureData> = {};

  const loadFurniture = async (...furniture: string[]) => {
    const uniqueFurniture = [...new Set(furniture)].filter(
      (furnitureId) => !$furnitureMap[furnitureId],
    );

    const spriteSheet: string[] = uniqueFurniture.map((furnitureId: string) =>
      System.api.getPath(`/furniture/sheet.json?furnitureId=${furnitureId}`),
    );

    await global.spriteSheets.load({
      spriteSheet,
      onLoad: async (furnitureSpriteSheetId) => {
        const furnitureId = new URLSearchParams(
          furnitureSpriteSheetId.split("?")[1],
        ).get("furnitureId");
        if ($furnitureMap[furnitureId]) return;

        const furnitureData = await fetch(
          System.api.getPath(`/furniture?furnitureId=${furnitureId}`),
        ).then((data) => data.json());

        $furnitureMap[furnitureId] = {
          furnitureId,
          spriteSheet: furnitureSpriteSheetId,
          label: furnitureData.label,
          description: furnitureData.description,
          direction: Object.keys(
            furnitureData.direction,
          ).reduce<FurnitureDirectionDataMap>(
            (dataMap, direction: CrossDirectionKeys) => {
              const { textures } = furnitureData.direction[direction];
              return {
                ...dataMap,
                [CrossDirection[direction.toUpperCase()]]: {
                  textures: textures.map((textureData) => ({
                    texture: textureData.texture,
                    bounds: textureData.bounds,
                    pivot: textureData?.pivot ?? { x: 0, y: 0 },
                    zIndex: textureData?.zIndex ?? 0,
                    hitArea: textureData?.hitArea,
                  })),
                },
              };
            },
            {} as FurnitureDirectionDataMap,
          ),
        };
        System.events.emit(
          SystemEvent.FURNITURE_TEXTURE_LOAD + `@` + furnitureId,
        );
      },
    });
  };

  const load = async () => {};

  const get = (furnitureId: string): FurnitureData | null =>
    $furnitureMap[furnitureId];

  return {
    load,
    loadFurniture,
    get,
  };
};
