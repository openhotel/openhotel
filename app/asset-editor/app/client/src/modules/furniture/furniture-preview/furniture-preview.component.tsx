import React, { useMemo } from "react";
import { ImageComponent } from "shared/components/image";
import { SpriteComponent } from "shared/components";
import { useFurniture, useScale } from "shared/hooks";
import { FurnitureDirection } from "shared/enums";
//@ts-ignore
import styles from "./furniture-preview.module.scss";

type Props = {
  direction: FurnitureDirection;
};

export const FurniturePreviewComponent: React.FC<Props> = ({ direction }) => {
  const { data } = useFurniture();
  const { scale } = useScale();

  const furnitureDirection = useMemo(
    () => data?.furniture?.direction?.[direction],
    [data, direction],
  );

  const TILE_SIZE = {
    width: 48,
    height: 24,
  };
  const TILE_SIZE_PADDING = {
    width: 1,
  };

  if (!data || !furnitureDirection) return null;

  return (
    <div
      style={{
        width: TILE_SIZE.width * scale,
      }}
      className={styles.wrapper}
    >
      <div
        className={styles.preview}
        style={{
          left: (TILE_SIZE.width / 2 - TILE_SIZE_PADDING.width) * scale,
          height:
            ((data?.furniture?.size?.height || 1) + TILE_SIZE.height) * scale,
          width: TILE_SIZE.width * scale,
          marginTop: (TILE_SIZE.height / 2) * scale,
          marginBottom: (-TILE_SIZE.height / 2) * scale,
          transform: `translate(-${(TILE_SIZE.width / 2) * scale}px, -${(TILE_SIZE.height / 2) * scale}px)`,
        }}
      >
        <ImageComponent
          src="/tile_v1_base.png"
          className={styles.topTile}
          style={{
            left: TILE_SIZE_PADDING.width * 2 * scale,
          }}
        />
        <ImageComponent
          src="/tile_v1_base.png"
          className={styles.bottomTile}
          style={{
            left: TILE_SIZE_PADDING.width * 2 * scale,
            top: (data?.furniture?.size?.height || 1) * scale,
          }}
        />
        {furnitureDirection?.textures
          .sort((textureA, textureB) => textureA.zIndex - textureB.zIndex)
          ?.map((furnitureTexture, index) => (
            <SpriteComponent
              className={styles.previewSprite}
              key={furnitureTexture.texture}
              sprite={data?.sprite}
              spriteSheet={data?.sheet}
              // texture={furnitureTexture.texture}
              frame={data?.sheet.frames[furnitureTexture.texture].frame}
              clean={true}
              style={{
                position: "absolute",
                top:
                  (-data.sheet.frames[furnitureTexture.texture].frame.h +
                    furnitureTexture.pivot.y +
                    (data?.furniture?.size?.height || 1) +
                    TILE_SIZE.height / 2) *
                  scale,
                left:
                  (-Math.round(
                    data.sheet.frames[furnitureTexture.texture].frame.w / 2,
                  ) +
                    furnitureTexture.pivot.x +
                    TILE_SIZE.width / 2 +
                    TILE_SIZE_PADDING.width) *
                  scale,
              }}
            />
          ))}
      </div>
    </div>
  );
};
