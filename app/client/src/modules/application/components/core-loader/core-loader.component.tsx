import React, { PropsWithChildren, useMemo } from "react";
import { AssetEnum, SpriteSheetEnum, TextureEnum } from "shared/enums";
import { useTextures, useUpdate } from "@openhotel/pixi-components";
import { LoaderAssetsComponent } from "shared/components";
import { LoaderItem } from "shared/types";
import { useAssets } from "shared/hooks";
import { parse } from "yaml";
import { useTranslation } from "react-i18next";
type Props = {} & PropsWithChildren;

export const CoreLoaderComponent: React.FC<Props> = ({ children }) => {
  const { update, lastUpdate } = useUpdate();
  const { loadSpriteSheet, loadTexture, getTexture, getSpriteSheet } =
    useTextures();
  const { setAsset, getAsset } = useAssets();
  const { t } = useTranslation();

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
        label: t("system.asset_label"),
        items: assets,
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
        label: t("system.sprite_sheet_label"),
        items: spriteSheets,
        func: loadSpriteSheet,
      },
      {
        label: t("system.texture_label"),
        items: textures,
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
    t,
  ]);

  return (
    <LoaderAssetsComponent
      loaderItems={loaderItems}
      children={children}
      onDone={update}
    />
  );
};
