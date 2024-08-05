import { Furniture, FurnitureCollection } from "shared/enums";
import { parse } from "yaml";
import {
  CrossDirectionKeys,
  FurnitureData,
  FurnitureDirectionDataMap,
} from "shared/types";

export const furniture = () => {
  const furnitureMap: Record<string, FurnitureData> = {};

  const load = async () => {
    for (const fullFurnitureId of Object.values(Furniture)) {
      const [collectionId] = fullFurnitureId.split("/");
      const spriteSheet = FurnitureCollection[collectionId.toUpperCase()];

      const furnitureData = await fetch(`furniture/${fullFurnitureId}.yml`)
        .then((data) => data.text())
        .then(parse);

      furnitureMap[fullFurnitureId] = {
        id: fullFurnitureId,
        label: furnitureData.label,
        collection: collectionId,
        spriteSheet,
        size: furnitureData.size,
        direction: Object.keys(
          furnitureData.direction,
        ).reduce<FurnitureDirectionDataMap>(
          (dataMap, direction: CrossDirectionKeys) => {
            const { textures } = furnitureData.direction[direction];
            return {
              ...dataMap,
              [direction]: {
                textures: textures.map((textureData) => ({
                  texture: textureData.name,
                  bounds: textureData.bounds,
                  pivot: textureData.pivot,
                  zIndex: textureData.zIndex,
                  hitArea: textureData.hitArea,
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
