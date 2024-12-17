import {
  FurnitureData,
  FurnitureDirectionDataMap,
  CrossDirectionKeys,
} from "shared/types";
import { CrossDirection, FurnitureType } from "shared/enums";
import { global } from "@tu/tulip";
import { parse } from "yaml";
import { System } from "system/system";

export const furniture = () => {
  const $furnitureMap: Record<string, FurnitureData> = {};

  let $furniture: string[] = [];

  const loadFurniture = async (...furniture: string[]) => {
    //TODO check $furniture -- furniture
    const uniqueFurniture = [...new Set(furniture)].filter(
      (furnitureId) => !$furnitureMap[furnitureId],
    );

    const spriteSheet: string[] = uniqueFurniture.map(
      (furnitureId: string) => `/data/${furnitureId}/sheet.json`,
    );

    const furnitureLoader = System.loader.addItems({
      items: furniture.map((furnitureId) => furnitureId.split("@").join(" ")),
      startLabel: "Loading furniture...",
      endLabel: "Furniture loaded!",
      prefix: "Loading",
      suffix: "furniture",
    });

    await global.spriteSheets.load({
      spriteSheet,
      onLoad: async (furnitureSpriteSheetId) => {
        const furnitureId = furnitureSpriteSheetId.split("/")[2];

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
        furnitureLoader.resolve(furnitureId.split("@").join(" "));
      },
    });
  };

  const load = async () => {
    $furniture = await fetch("/data/furniture.yml")
      .then((data) => data.text())
      .then(parse);

    // const furnitureLoader = System.loader.addItems({
    //   items: furniture.map((furnitureId) => furnitureId.split("@").join(" ")),
    //   startLabel: "Loading furniture...",
    //   endLabel: "Furniture loaded!",
    //   prefix: "Loading",
    //   suffix: "furniture",
    // });
    //
    // await global.spriteSheets.load({
    //   spriteSheet,
    //   onLoad: async (furnitureSpriteSheetId) => {
    //     const furnitureId = furnitureSpriteSheetId.split("/")[2];
    //
    //     const furnitureData = await fetch(`data/${furnitureId}/data.yml`)
    //       .then((data) => data.text())
    //       .then(parse);
    //
    //     $furnitureMap[furnitureId] = {
    //       id: furnitureId,
    //       spriteSheet: `/data/${furnitureId}/sheet.json`,
    //       type: FurnitureType[
    //         furnitureData.type.toUpperCase() ?? "FURNITURE"
    //       ] as unknown as FurnitureType,
    //       label: furnitureData.label,
    //       size: furnitureData?.size,
    //       description: furnitureData.description,
    //       direction: Object.keys(
    //         furnitureData.direction,
    //       ).reduce<FurnitureDirectionDataMap>(
    //         (dataMap, direction: CrossDirectionKeys) => {
    //           const { textures } = furnitureData.direction[direction];
    //           return {
    //             ...dataMap,
    //             [CrossDirection[direction.toUpperCase()]]: {
    //               textures: textures.map((textureData) => ({
    //                 texture: textureData.texture,
    //                 bounds: textureData.bounds,
    //                 pivot: textureData?.pivot ?? { x: 0, y: 0 },
    //                 zIndex: textureData?.zIndex ?? 0,
    //                 hitArea: textureData?.hitArea,
    //               })),
    //             },
    //           };
    //         },
    //         {} as FurnitureDirectionDataMap,
    //       ),
    //     };
    //     furnitureLoader.resolve(furnitureId.split("@").join(" "));
    //   },
    // });
  };

  const get = (furnitureId: string): FurnitureData | null =>
    $furnitureMap[furnitureId];

  return {
    load,
    loadFurniture,
    get,
  };
};
