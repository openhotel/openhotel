import React, { PropsWithChildren, useMemo } from "react";
import { AssetEnum, SpriteSheetEnum, TextureEnum } from "shared/enums";
import { useTextures } from "@oh/pixi-components";
import { LoaderAssetsComponent } from "shared/components";
import { LoaderItem } from "shared/types";
import { useAssets } from "shared/hooks";

type Props = {} & PropsWithChildren;

export const CoreLoaderComponent: React.FC<Props> = ({ children }) => {
  const { getSpriteSheet, getTexture } = useTextures();
  const { setAsset } = useAssets();

  const loaderItems = useMemo(() => {
    const assets = Object.values(AssetEnum);
    const spriteSheets = Object.values(SpriteSheetEnum);
    const textures = Object.values(TextureEnum);

    return [
      {
        items: assets,
        startLabel: "Loading assets",
        endLabel: "Assets loaded!",
        prefix: "Loading",
        suffix: "asset",
        func: async (asset: AssetEnum) => {
          setAsset(asset, await (await fetch(asset)).json());
        },
      },
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
  }, [getSpriteSheet, getTexture, setAsset]);

  return (
    <LoaderAssetsComponent loaderItems={loaderItems} children={children} />
  );
};
