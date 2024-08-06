import { Furniture, FurnitureCollection } from "shared/enums";
import { parse } from "yaml";
import {
  CrossDirectionKeys,
  FurnitureData,
  FurnitureDirectionDataMap,
} from "shared/types";

export const furniture = () => {
  const furnitureMap: Record<string, FurnitureData> = {};

  const $getDefaultFurnitureData = (furnitureId: string) =>
    fetch(`furniture/${furnitureId}.yml`)
      .then((data) => data.text())
      .then(parse);

  const load = async () => {
    for (const fullFurnitureId of Object.values(Furniture)) {
      const [collectionId] = fullFurnitureId.split("/");
      const spriteSheet = FurnitureCollection[collectionId.toUpperCase()];

      let furnitureData = furnitureMap[Furniture.DEFAULT__FURNITURE];
      try {
        furnitureData = await $getDefaultFurnitureData(fullFurnitureId);
      } catch (e) {
        console.error(`Furniture ${fullFurnitureId} not loaded!`);
      }

      furnitureMap[fullFurnitureId] = {
        id: fullFurnitureId,
        label: furnitureData.label,
        collection: collectionId,
        spriteSheet,
        size: furnitureData?.size,
        direction: Object.keys(
          furnitureData.direction,
        ).reduce<FurnitureDirectionDataMap>(
          (dataMap, direction: CrossDirectionKeys) => {
            const { textures } = furnitureData.direction[direction];
            return {
              ...dataMap,
              [direction]: {
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

  const get = (furniture: Furniture): FurnitureData | null =>
    furnitureMap[furniture];

  return {
    load,
    get,
  };
};
