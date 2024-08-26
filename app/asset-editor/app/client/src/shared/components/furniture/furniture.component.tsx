import React from "react";
import { FurniturePosition, SpriteSheet, SpriteSheetPoint } from "shared/types";
import { SpriteFrameComponent } from "shared/components/sprite-frame";
import { getPositionFromIsometricPosition } from "shared/utils";

type Props = {
  sheet: SpriteSheet;
  sprite: string;
  frame: string;

  scale?: number;

  pivot?: SpriteSheetPoint;
  position?: Partial<FurniturePosition>;
};

export const FurnitureComponent = ({
  sheet,
  sprite,
  frame: frameName,

  scale = 1,

  pivot = { x: 0, y: 0 },
  position = { x: 0, z: 0 },
}: Props) => {
  const { frame } = sheet.frames[frameName];
  const pos = getPositionFromIsometricPosition(position);

  return (
    <div
      style={{
        position: "absolute",
        left: `${(24 + pivot.x + pos.x) * scale}px`,
        top: `${(-frame.h + 12 + pivot.y + pos.y) * scale}px`,
      }}
    >
      <SpriteFrameComponent
        sprite={sprite}
        size={sheet.meta.size}
        frame={frame}
        border={false}
        scale={scale}
      />
    </div>
  );
};
