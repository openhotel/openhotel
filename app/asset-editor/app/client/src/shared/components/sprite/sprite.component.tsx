import React, { CSSProperties, useCallback, useMemo } from "react";
import { SpriteSheet, SpriteSheetRectangle } from "shared/types";

//@ts-ignore
import styles from "./sprite.module.scss";
import { cn } from "shared/utils";
import { useScale } from "shared/hooks/useScale";

type Props = {
  className?: string;
  style?: CSSProperties;

  sprite: string;

  spriteSheet?: SpriteSheet;
  frame?: SpriteSheetRectangle;

  clean?: boolean;
};

export const SpriteComponent: React.FC<Props> = ({
  className,
  style,
  spriteSheet,
  frame,
  sprite,

  clean = false,
}) => {
  const { scale, setScale } = useScale();

  const defaultFrame = useMemo(
    () =>
      frame && (frame.w || frame.h)
        ? frame
        : {
            x: 0,
            y: 0,
            w: spriteSheet.meta.size.w ?? 0,
            h: spriteSheet.meta.size.h ?? 0,
          },
    [spriteSheet, frame],
  );

  const onClick = useCallback(
    (event) => {
      event.preventDefault();
      setScale(scale + 1);
    },
    [setScale, scale],
  );

  const onContextMenu = useCallback(
    (event) => {
      event.preventDefault();
      setScale(scale - 1);
    },
    [setScale, scale],
  );

  if (!defaultFrame) return null;

  return (
    <div
      style={style}
      className={cn(styles.wrapper, className, { [styles.clean]: clean })}
    >
      <div
        onClick={onClick}
        onContextMenu={onContextMenu}
        style={{
          width: (defaultFrame.w ?? 0) * scale,
          height: (defaultFrame.h ?? 0) * scale,
        }}
        className={styles.sprite}
      >
        {clean ? null : <div className={styles.background} />}
        <img
          style={{
            left: `-${(defaultFrame.x ?? 0) * scale}px`,
            top: `-${(defaultFrame.y ?? 0) * scale}px`,
          }}
          width={spriteSheet.meta.size.w * scale}
          height={spriteSheet.meta.size.h * scale}
          src={sprite}
        />
      </div>
    </div>
  );
};
