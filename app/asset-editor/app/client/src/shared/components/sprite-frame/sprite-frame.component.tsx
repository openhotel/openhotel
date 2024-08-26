import React from "react";
import { SpriteSheetRectangle, SpriteSheetSize } from "shared/types";
import styles from "./sprite-frame.module.scss";

type Props = {
  sprite: string;
  size: SpriteSheetSize;
  frame: SpriteSheetRectangle;
  scale?: number;
  border?: boolean;
};

export const SpriteFrameComponent: React.FC<Props> = ({
  frame,
  size,
  sprite,
  scale = 1,
  border = true,
}) => {
  return (
    <div
      className={styles.spriteFrame}
      style={{
        width: frame.w * scale,
        height: frame.h * scale,
        border: border ? "1px solid rgba(255, 255, 255, 0.5)" : null,
      }}
    >
      <img
        src={sprite}
        style={{
          width: size.w * scale,
          height: size.h * scale,
          left: -frame.x * scale,
          top: -frame.y * scale,
        }}
      />
    </div>
  );
};
