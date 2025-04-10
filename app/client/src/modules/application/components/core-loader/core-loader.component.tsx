import React, { PropsWithChildren, useMemo } from "react";
import { AssetEnum, SpriteSheetEnum, TextureEnum } from "shared/enums";
import { useTextures, useUpdate } from "@oh/pixi-components";
import { LoaderAssetsComponent } from "shared/components";
import { LoaderItem } from "shared/types";
import { useAssets } from "shared/hooks";
import { parse } from "yaml";

type Props = {} & PropsWithChildren;

export const CoreLoaderComponent: React.FC<Props> = ({ children }) => {
  const { update, lastUpdate } = useUpdate();
  const { loadSpriteSheet, loadTexture, getTexture, getSpriteSheet } =
    useTextures();
  const { setAsset, getAsset } = useAssets();

  const loaderItems = useMemo(() => {
    const assets = Object.values(AssetEnum).filter((asset) => !getAsset(asset));
    const spriteSheets = Object.values(SpriteSheetEnum).filter(
      (spriteSheet) => !getSpriteSheet(spriteSheet),
    );
    const textures = Object.values(TextureEnum).filter(
      (texture) => !getTexture({ texture }),
    );

    return [
      {
        items: assets,
        startLabel: "Loading assets",
        endLabel: "Assets loaded!",
        prefix: "Loading",
        suffix: "asset",
        func: async (asset: AssetEnum) => {
          const response = await fetch(asset);
          const format = asset.split(".")[1];

          let data = await (format === "json"
            ? response.json()
            : response.text());
          if (format === "yml") data = parse(data);
          setAsset(asset, data);
        },
      },
      {
        items: spriteSheets,
        startLabel: "Loading sprite-sheets",
        endLabel: "Sprite-sheets loaded!",
        prefix: "Loading",
        suffix: "sprite-sheet",
        func: loadSpriteSheet,
      },
      {
        items: textures,
        startLabel: "Loading textures",
        endLabel: "Textures loaded!",
        prefix: "Loading",
        suffix: "texture",
        func: loadTexture,
      },
    ].filter((item) => item.items.length) as LoaderItem[];
  }, [
    loadSpriteSheet,
    loadTexture,
    setAsset,
    getTexture,
    getSpriteSheet,
    getAsset,
    lastUpdate,
  ]);

  return (
    <LoaderAssetsComponent
      loaderItems={loaderItems}
      children={children}
      onDone={update}
    />
  );
};
