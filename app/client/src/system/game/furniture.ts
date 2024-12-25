import {
  CrossDirectionKeys,
  FurnitureData,
  FurnitureDirectionDataMap,
} from "shared/types";
import { CrossDirection, SystemEvent } from "shared/enums";
import { global } from "@tu/tulip";
import { parse } from "yaml";
import { System } from "system/system";

export const furniture = () => {
  const $furnitureMap: Record<string, FurnitureData> = {};

  let $furniture: string[] = [];

  const loadFurniture = async (...furniture: string[]) => {
    const uniqueFurniture = [...new Set(furniture)].filter(
      (furnitureId) =>
        !$furnitureMap[furnitureId] || !$furniture.includes(furnitureId),
    );

    const spriteSheet: string[] = uniqueFurniture.map(
      (furnitureId: string) => `/data/${furnitureId}/sheet.json`,
    );

    await global.spriteSheets.load({
      spriteSheet,
      onLoad: async (furnitureSpriteSheetId) => {
        const furnitureId = furnitureSpriteSheetId.split("/")[2];
        if ($furnitureMap[furnitureId]) return;

        const furnitureData = await fetch(`data/${furnitureId}/data.yml`)
          .then((data) => data.text())
          .then(parse);

        $furnitureMap[furnitureId] = {
          furnitureId,
          spriteSheet: `/data/${furnitureId}/sheet.json`,
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

  const load = async () => {
    $furniture = await fetch("/data/furniture.yml")
      .then((data) => data.text())
      .then(parse);
  };

  const get = (furnitureId: string): FurnitureData | null =>
    $furnitureMap[furnitureId];

  const exists = (furnitureId: string): boolean =>
    Boolean($furniture.includes(furnitureId));

  return {
    load,
    loadFurniture,
    get,
    exists,
  };
};
