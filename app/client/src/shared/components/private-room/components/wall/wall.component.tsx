import React, { useCallback, useMemo, useRef } from "react";
import {
  ContainerComponent,
  ContainerRef,
  DisplayObjectProps,
  EventMode,
  GraphicsComponent,
  GraphicsRef,
  GraphicType,
  NineSliceSpriteComponent,
  SpriteComponent,
} from "@openhotel/pixi-components";
import { CrossDirection, SpriteSheetEnum } from "shared/enums";
import { getPositionFromIsometricPosition, getZIndex } from "shared/utils";
import { Point2d, Point3d } from "shared/types";
import {
  TILE_SIZE,
  TILE_WIDTH,
  TILE_Y_HEIGHT,
  WALL_HEIGHT,
  WALL_WIDTH,
} from "shared/consts";
import { getWallIsometricPositionFromPosition } from "shared/utils/wall.utils";

type Props = {
  direction: CrossDirection.NORTH | CrossDirection.EAST | "corner";
  position: Point3d;
  height?: number;

  onPointerDown?: (position: Point2d) => void;
  onPointerMove?: (position: Point2d) => void;
  onPointerLeave?: () => void;
} & Omit<DisplayObjectProps<ContainerRef>, "position">;

const TOP_HEIGHT = 15;
const MIDDLE_SLICE_CORRECTION = 2;

export const PrivateRoomWallComponent: React.FC<Props> = ({
  direction,
  position,
  height = WALL_HEIGHT,
  pivot,
  onPointerDown,
  onPointerMove,
  onPointerLeave,
  ...props
}) => {
  const graphicsRef = useRef<GraphicsRef>(null);
  const zIndex = useMemo(() => getZIndex(position, -0), [position]);
  const $position = useMemo(
    () =>
      getPositionFromIsometricPosition({
        x: position.x,
        z: position.z,
        y: 0,
      }),
    [position],
  );

  const middleHeight = useMemo(
    () =>
      height -
      position.y * TILE_Y_HEIGHT -
      TOP_HEIGHT +
      MIDDLE_SLICE_CORRECTION,
    [position],
  );

  const directionText = useMemo(() => {
    switch (direction) {
      case "corner":
        return "b";
      case CrossDirection.EAST:
        return "z";
      case CrossDirection.NORTH:
        return "x";
    }
  }, [direction]);

  const $pivot = useMemo(() => {
    switch (direction) {
      case CrossDirection.NORTH:
        return {
          x: 5,
          y: 0,
        };
      case CrossDirection.EAST:
        return {
          x: -25,
          y: 0,
        };
      case "corner":
        return {
          x: -20,
          y: 3,
        };
    }
  }, [direction]);

  const $getPointFromEvent = useCallback(
    (event) => {
      const position = graphicsRef.current.component.toLocal(event.global);
      const isometricPosition = getWallIsometricPositionFromPosition(
        {
          x: position.x,
          y: position.y,
        },
        direction,
      );
      return {
        x: (isometricPosition.x - 1) % TILE_WIDTH,
        y: height - isometricPosition.y,
      };
    },
    [onPointerDown, height, direction],
  );

  const $onPointerDown = useCallback(
    (event) => {
      onPointerDown?.($getPointFromEvent(event));
    },
    [onPointerDown, $getPointFromEvent],
  );

  const $onPointerMove = useCallback(
    (event) => {
      onPointerMove?.($getPointFromEvent(event));
    },
    [onPointerMove, $getPointFromEvent],
  );

  const renderWall = useMemo(() => {
    if (direction === "corner")
      return (
        <SpriteComponent
          zIndex={zIndex}
          texture={`wall-${directionText}`}
          spriteSheet={SpriteSheetEnum.ROOM}
        />
      );
    return (
      <>
        <GraphicsComponent
          ref={graphicsRef}
          type={GraphicType.POLYGON}
          polygon={[
            0,
            0,
            //
            TILE_SIZE.width / 2,
            TILE_SIZE.height / 2,
            //
            TILE_SIZE.width / 2,
            TOP_HEIGHT + middleHeight + TILE_SIZE.height / 2,
            //
            0,
            TOP_HEIGHT + middleHeight,
          ]}
          position={{
            x: direction === CrossDirection.NORTH ? 30 : 0,
            y: WALL_WIDTH / 2 - 1,
          }}
          scale={{
            x: direction === CrossDirection.NORTH ? -1 : 1,
          }}
          // tint={0xff00ff * Math.random()}
          // cursor={Cursor.POINTER}
          eventMode={EventMode.STATIC}
          onPointerDown={$onPointerDown}
          onPointerMove={$onPointerMove}
          onPointerLeave={onPointerLeave}
          alpha={0}
          zIndex={zIndex + 1}
        />
        <SpriteComponent
          zIndex={zIndex}
          texture={`wall-${directionText}-top`}
          spriteSheet={SpriteSheetEnum.ROOM}
        />
        <NineSliceSpriteComponent
          alpha={1}
          zIndex={zIndex}
          spriteSheet={SpriteSheetEnum.ROOM}
          texture={`wall-${directionText}-mid`}
          leftWidth={8}
          rightWidth={1}
          topHeight={1}
          bottomHeight={1}
          height={middleHeight}
          position={{
            y: TOP_HEIGHT,
          }}
        />
        <SpriteComponent
          zIndex={zIndex}
          texture={`wall-${directionText}-bottom`}
          spriteSheet={SpriteSheetEnum.ROOM}
          position={{
            y: TOP_HEIGHT + middleHeight,
          }}
        />
      </>
    );
  }, [
    direction,
    directionText,
    middleHeight,
    $onPointerDown,
    $onPointerMove,
    zIndex,
  ]);

  return useMemo(
    () => (
      <ContainerComponent
        zIndex={zIndex}
        position={$position}
        pivot={{
          x: $pivot.x + (pivot?.x ?? 0),
          y: height - WALL_WIDTH / 2 + $pivot.y + (pivot?.y ?? 0),
        }}
        tint={0xc4d3dd}
        {...props}
      >
        {renderWall}
      </ContainerComponent>
    ),
    [zIndex, $position, $pivot, pivot, height, props],
  );
};
