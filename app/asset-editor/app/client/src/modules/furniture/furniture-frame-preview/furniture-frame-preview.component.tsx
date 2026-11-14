import React, { useMemo } from "react";
import { ImageComponent } from "shared/components/image";
import { SpriteComponent } from "shared/components";
import { useFurniture, useScale } from "shared/hooks";
import { FurnitureDirection } from "shared/enums";
//@ts-ignore
import styles from "./furniture-frame-preview.module.scss";

type Props = {
  direction: FurnitureDirection;
};

export const FurnitureFramePreviewComponent: React.FC<Props> = ({
  direction,
}) => {
  const { data } = useFurniture();
  const { scale } = useScale();

  const furnitureDirection = useMemo(
    () => data?.furniture?.direction?.[direction],
    [data, direction],
  );

  const BACKGROUND_FRAME_SIZE = {
    width: 48,
    height: 76,
  };

  if (!data || !furnitureDirection) return null;

  const { width, height } = data.furniture.size;

  const widthPercentage = (width / (width + height)) * 100;
  const heightPercentage = (height / (width + height)) * 100;

  const left = Math.round(BACKGROUND_FRAME_SIZE.width / 2 - width) * scale;
  const top =
    Math.round(1 + BACKGROUND_FRAME_SIZE.height / 2 - (width + height) / 2) *
    scale;

  return (
    <div className={styles.wrapper}>
      <div className={styles.preview}>
        <ImageComponent
          src={`/${direction}_wall.png`}
          style={{
            left: scale,
          }}
        />
        <ImageComponent
          src={`/${direction}_wall.png`}
          className={styles.top}
          style={{
            left: 0,
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
              frame={data?.sheet.frames[furnitureTexture.texture].frame}
              clean={true}
              style={{
                position: "absolute",
                left: left - furnitureTexture.pivot.x * scale,
                top: top - furnitureTexture.pivot.y * scale,
              }}
            />
          ))}
        <div
          style={{
            position: "absolute",
            opacity: 0.5,
            width: width * 2 * scale,
            height: (height + width) * scale,
            backgroundColor: "yellow",
            left,
            top: top - 1 * scale,
            clipPath:
              direction === FurnitureDirection.NORTH
                ? `polygon(100% 0, 100% ${heightPercentage}%, 0 100%, 0 ${widthPercentage}%)`
                : `polygon(100% ${widthPercentage}%, 100% 100%, 0 ${heightPercentage}%, 0 0)`,
          }}
        />
      </div>
    </div>
  );
};
