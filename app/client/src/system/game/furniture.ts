import {
  CrossDirectionKeys,
  FurnitureData,
  FurnitureDirectionData,
  FurnitureDirectionDataMap,
} from "shared/types";
import { CrossDirection, FurnitureType, SpriteSheetEnum } from "shared/enums";
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
  };

  const get = (furnitureId: string): FurnitureData | null =>
    $furnitureMap[furnitureId];

  const exists = (furnitureId: string): boolean =>
    Boolean($furniture.includes(furnitureId));

  const getUnloaded = (type: FurnitureType): FurnitureData => {
    if (type === FurnitureType.FRAME) {
      const furnitureDirectionNorth: FurnitureDirectionData = {
        textures: [
          {
            texture: "frame-north",
            bounds: {
              width: 0,
              height: 0,
            },
            pivot: {
              x: -12,
              y: -19,
            },
            zIndex: 0,
            hitArea: [],
          },
        ],
      };
      const furnitureDirectionEast: FurnitureDirectionData = {
        textures: [
          {
            texture: "frame-east",
            bounds: {
              width: 0,
              height: 0,
            },
            pivot: {
              x: -12,
              y: -19,
            },
            zIndex: 0,
            hitArea: [],
          },
        ],
      };
      return {
        id: "unloaded",
        direction: {
          [CrossDirection.NORTH]: furnitureDirectionNorth,
          [CrossDirection.EAST]: furnitureDirectionEast,
          [CrossDirection.SOUTH]: furnitureDirectionNorth,
          [CrossDirection.WEST]: furnitureDirectionEast,
        },
        description: "asd",
        label: "asd",
        spriteSheet: SpriteSheetEnum.FURNITURE_UNLOADED,
        type,
      };
    }

    const furnitureDirection: FurnitureDirectionData = {
      textures: [
        {
          texture: "box",
          bounds: {
            width: 0,
            height: 0,
          },
          pivot: {
            x: -24,
            y: -38,
          },
          zIndex: 0,
          hitArea: [],
        },
      ],
    };
    return {
      id: "unloaded",
      direction: {
        [CrossDirection.NORTH]: furnitureDirection,
        [CrossDirection.EAST]: furnitureDirection,
        [CrossDirection.SOUTH]: furnitureDirection,
        [CrossDirection.WEST]: furnitureDirection,
      },
      description: "asd",
      label: "asd",
      spriteSheet: SpriteSheetEnum.FURNITURE_UNLOADED,
      type,
    };
  };

  return {
    load,
    loadFurniture,
    get,
    getUnloaded,
    exists,
  };
};
