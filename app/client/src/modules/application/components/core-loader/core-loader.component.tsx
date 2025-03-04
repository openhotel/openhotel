import React, { PropsWithChildren, useMemo } from "react";
import { SpriteSheetEnum, TextureEnum } from "shared/enums";
import { useTextures } from "@oh/pixi-components";
import { LoaderComponent } from "shared/components";
import { LoaderItem } from "shared/types";

type Props = {} & PropsWithChildren;

export const CoreLoaderComponent: React.FC<Props> = ({ children }) => {
  const { getSpriteSheet, getTexture } = useTextures();

  const loaderItems = useMemo(() => {
    const spriteSheets = Object.values(SpriteSheetEnum);
    const textures = Object.values(TextureEnum);

    return [
      {
        items: spriteSheets,
        startLabel: "Loading sprite-sheets",
        endLabel: "Sprite-sheets loaded!",
        prefix: "Loading",
        suffix: "sprite-sheet",
        func: getSpriteSheet,
      },
      {
        items: textures,
        startLabel: "Loading textures",
        endLabel: "Textures loaded!",
        prefix: "Loading",
        suffix: "texture",
        func: (texture: string) => getTexture({ texture }),
      },
    ] as LoaderItem[];
  }, [getSpriteSheet, getTexture]);

  return <LoaderComponent loaderItems={loaderItems} children={children} />;
};
