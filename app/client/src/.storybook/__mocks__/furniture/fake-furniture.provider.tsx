import React, { useCallback } from "react";
import { FurnitureContext, useFurnitureStore } from "../../../shared/hooks";
import { parse } from "yaml";
import {
  FurnitureData,
  FurnitureDirectionDataMap,
} from "../../../shared/types";
import { CrossDirection } from "../../../shared/enums";
import { useTextures } from "@openhotel/pixi-components";

export const FakeFurnitureProvider = ({ children }) => {
  const { loadSpriteSheet, getSpriteSheet } = useTextures();
  const { add, get } = useFurnitureStore();

  const load = useCallback(
    async (...furniture: string[]) => {
      const uniqueFurniture = [...new Set(furniture)];

      if (!uniqueFurniture.length) return;

      for (const furnitureId of uniqueFurniture) {
        const spriteSheetPath = `${furnitureId}/sheet.json`;
        if (getSpriteSheet(spriteSheetPath)) continue;

        await loadSpriteSheet(spriteSheetPath);

        const furnitureData = await fetch(`${furnitureId}/data.yml`)
          .then((data) => data.text())
          .then(parse);

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
          ).reduce<FurnitureDirectionDataMap>((dataMap, direction: any) => {
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
          }, {}) as FurnitureDirectionDataMap,
        } as FurnitureData);
      }
    },
    [add],
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
