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
    const { furniture } = await fetch("/data/furniture.yml")
      .then((data) => data.text())
      .then(parse);
    const spriteSheet: string[] = [
      ...new Set(furniture.map((furnitureId) => furnitureId.split("/")[0])),
    ].map((collectionId) => `/data/${collectionId}/${collectionId}.json`);

    await global.spriteSheets.load({
      spriteSheet,
      onLoad: (collectionId) => {
        console.info(`Spritesheet ${collectionId}`);
      },
    });
    for (const fullFurnitureId of furniture) {
      const [collectionId, furnitureId] = fullFurnitureId.split("/");

      console.info(`Furniture ${fullFurnitureId}`);
      const furnitureData = await fetch(
        `data/${collectionId}/${furnitureId}.yml`,
      )
        .then((data) => data.text())
        .then(parse);

      $furnitureMap[fullFurnitureId] = {
        id: fullFurnitureId,
        collectionId,
        spriteSheet: `/data/${collectionId}/${collectionId}.json`,
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
