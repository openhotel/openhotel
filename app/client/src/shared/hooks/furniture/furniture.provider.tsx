import React, { ReactNode, useCallback } from "react";
import { FurnitureContext } from "./furniture.context";
import { useFurnitureStore } from "./furniture.store";
import { useTextures } from "@openhotel/pixi-components";
import { CrossDirectionKeys, FurnitureDirectionDataMap } from "shared/types";
import { CrossDirection } from "shared/enums";
import { useApiPath } from "shared/hooks";

type FurnitureProps = {
  children: ReactNode;
};

export const FurnitureProvider: React.FunctionComponent<FurnitureProps> = ({
  children,
}) => {
  const { loadSpriteSheet, getSpriteSheet } = useTextures();
  const { getPath } = useApiPath();
  const { add, get: $get, furniture } = useFurnitureStore();

  const load = useCallback(
    async (...furniture: string[]) => {
      const uniqueFurniture = [...new Set(furniture)].filter(
        (furnitureId) => !$get(furnitureId),
      );

      if (!uniqueFurniture.length) return;

      for (const furnitureId of uniqueFurniture) {
        const spriteSheetPath = getPath(
          `/furniture/sheet.json?furnitureId=${furnitureId}`,
        );

        await loadSpriteSheet(spriteSheetPath);

        const furnitureData = await fetch(
          getPath(`/furniture?furnitureId=${furnitureId}`),
        ).then((data) => data.json());

        add({
          furnitureId,
          type: furnitureData.type,
          spriteSheet: spriteSheetPath,
          label: furnitureData.label,
          description: furnitureData.description,
          icon: furnitureData.icon,
          size: furnitureData.size,
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
        });
      }
    },
    [add, $get, getPath, loadSpriteSheet, getSpriteSheet],
  );

  const get = useCallback(
    (furnitureId: string) => furniture[furnitureId],
    [furniture],
  );

  return (
    <FurnitureContext.Provider
      value={{
        load,
        get,
      }}
      children={children}
    />
  );
};
