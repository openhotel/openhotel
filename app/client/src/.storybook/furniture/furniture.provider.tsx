import React, { ReactNode, useCallback } from "react";
import { FurnitureContext } from "./furniture.context";
import { useFurnitureStore } from "./furniture.store";
import { useTextures } from "@openhotel/pixi-components";
import {
  CrossDirectionKeys,
  FurnitureDirectionDataMap,
} from "../../shared/types";
import { CrossDirection } from "../../shared/enums";
import { parse } from "yaml";

type FurnitureProps = {
  children: ReactNode;
};

export const SBFurnitureProvider: React.FunctionComponent<FurnitureProps> = ({
  children,
}) => {
  const { loadSpriteSheet, getSpriteSheet } = useTextures();
  const { add, get: $get, furniture } = useFurnitureStore();

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
    [add, $get, loadSpriteSheet, getSpriteSheet],
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
