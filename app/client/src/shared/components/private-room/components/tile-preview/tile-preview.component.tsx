import React, { useMemo } from "react";
import { CrossDirection, SpriteSheetEnum } from "shared/enums";
import { getPositionFromIsometricPosition, getZIndex } from "shared/utils";
import { EventMode, SpriteComponent } from "@openhotel/pixi-components";
import { Point3d } from "shared/types";

type Props = {
  type: "tile" | "stairs";
  direction?: CrossDirection.NORTH | CrossDirection.EAST;
  position: Point3d;
};

export const PrivateRoomTilePreview: React.FC<Props> = ({
  type,
  direction,
  position,
}) => {
  return useMemo(
    () => (
      <SpriteComponent
        eventMode={EventMode.NONE}
        texture={`${type}-preview`}
        scale={{
          x: direction === CrossDirection.NORTH ? 1 : -1,
        }}
        spriteSheet={SpriteSheetEnum.ROOM}
        zIndex={getZIndex(position, 0.3)}
        position={getPositionFromIsometricPosition(position)}
        pivot={{
          x: type === "tile" ? -2 : 0,
          y: type === "stairs" ? 18 : 0,
        }}
      />
    ),
    [type, direction, position],
  );
};
