import {
  FurnitureData,
  FurnitureDirectionDataMap,
  CrossDirectionKeys,
} from "shared/types";
import { CrossDirection, FurnitureType } from "shared/enums";
import { global } from "@tu/tulip";
import { parse } from "yaml";

export const furniture = () => {
  const $furnitureMap: Record<string, FurnitureData> = {};

  const load = async () => {
    const furniture = await fetch("/data/furniture.yml")
      .then((data) => data.text())
      .then(parse);
    const spriteSheet: string[] = furniture.map(
      (furnitureId: string) => `/data/${furnitureId}/sheet.json`,
    );

    await global.spriteSheets.load({
      spriteSheet,
      onLoad: (furnitureId) => {
        console.info(`Furniture spritesheet ${furnitureId}`);
      },
    });
    for (const furnitureId of furniture) {
      console.info(`Furniture data ${furnitureId}`);
      const furnitureData = await fetch(`data/${furnitureId}/data.yml`)
        .then((data) => data.text())
        .then(parse);

      $furnitureMap[furnitureId] = {
        id: furnitureId,
        spriteSheet: `/data/${furnitureId}/sheet.json`,
        type: FurnitureType[
          furnitureData.type.toUpperCase() ?? "FURNITURE"
        ] as unknown as FurnitureType,
        label: furnitureData.label,
        size: furnitureData?.size,
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
    }
  };

  const get = (furnitureId: string): FurnitureData | null =>
    $furnitureMap[furnitureId];

  return {
    load,
    get,
  };
};
