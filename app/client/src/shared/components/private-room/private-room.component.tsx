import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ContainerComponent, ContainerRef } from "@openhotel/pixi-components";
import { CrossDirection, RoomPointEnum } from "shared/enums";
import {
  getPositionFromIsometricPosition,
  isCurrentPointStairs,
  isDoorRenderable,
  isWallRenderable,
} from "shared/utils";
import { Point2d, Point3d, PrivateRoom, Size2d } from "shared/types";
import {
  TILE_SIZE,
  WALL_DOOR_HEIGHT,
  WALL_HEIGHT,
  WALL_WIDTH,
} from "shared/consts";
import {
  PrivateRoomStairs,
  PrivateRoomTile,
  PrivateRoomTilePreview,
  PrivateRoomWallComponent,
} from "./components";

type Props = {
  ref?: React.Ref<ContainerRef>;
  onPointerTile?: (point: Point3d) => void;
  onHoverTile?: (data: PreviewTileData) => void;
  onClickWall?: (
    position: Point3d,
    point: Point2d,
    direction: CrossDirection,
  ) => void;
  onMoveWall?: (
    position: Point3d,
    point: Point2d,
    direction: CrossDirection,
  ) => void;
  onLeaveWall?: (direction: CrossDirection) => void;
  children?: React.ReactNode;
  pivotFix?: boolean;
} & PrivateRoom;

export type PreviewTileData = {
  point: Point3d;
  type: "tile" | "stairs";
  direction?: CrossDirection.NORTH | CrossDirection.EAST;
};

export const PrivateRoomComponent: React.FC<Props> = ({
  ref,
  layout,
  onPointerTile,
  onHoverTile,
  onClickWall,
  onMoveWall,
  onLeaveWall,
  children,
  pivotFix = true,
}) => {
  const $ref = useRef<ContainerRef>(null);
  const $sizeRef = useRef<ContainerRef>(null);

  const [rawRoomSize, setRawRoomSize] = useState<Size2d>({
    width: 0,
    height: 0,
  });
  const [previewData, setPreviewData] = useState<PreviewTileData | null>(null);

  const $onHoverTile = useCallback(
    (data: PreviewTileData | null) => {
      onHoverTile?.(data);
      setPreviewData(data);
    },
    [onHoverTile, setPreviewData],
  );

  ref &&
    useImperativeHandle(
      ref,
      () => ({
        ...$ref.current,
        getSize: () => $sizeRef?.current?.getSize?.() ?? rawRoomSize,
      }),
      [rawRoomSize],
    );

  const [tilesAndWalls, pivot] = useMemo(() => {
    const list = [];

    const roomSize = {
      width: Math.max(...layout.map((line) => line.length)),
      depth: layout.length,
    };

    const accumulatedPivot = {
      x: 0,
      y: 0,
    };

    for (let z = 0; z < roomSize.depth; z++) {
      const roomLine = layout[z];
      for (let x = 0; x < roomSize.width; x++) {
        if (roomLine[x] === RoomPointEnum.EMPTY) continue;

        const spawn = roomLine[x] === RoomPointEnum.SPAWN;
        const previewY = -((spawn ? 1 : (parseInt(roomLine[x] + "") ?? 1)) - 1);
        const y = Math.floor(previewY);
        const stairsDirection = isCurrentPointStairs(layout, { x, z });

        const position = {
          x,
          z,
          y,
        };

        const currentPosition = getPositionFromIsometricPosition(position);
        const currentWallPosition = getPositionFromIsometricPosition({
          ...position,
          y: 0,
        });
        if (accumulatedPivot.x > currentPosition.x)
          accumulatedPivot.x = currentPosition.x - WALL_WIDTH + 1;

        list.push(
          stairsDirection !== null ? (
            <PrivateRoomStairs
              key={`stairs${x}.${z}`}
              position={position}
              direction={stairsDirection}
              onPointerUp={() => onPointerTile?.(position)}
              onPointerEnter={() =>
                $onHoverTile({
                  point: position,
                  type: "stairs",
                  direction: stairsDirection,
                })
              }
              onPointerLeave={() => $onHoverTile(null)}
            />
          ) : (
            <PrivateRoomTile
              key={`tile${x}.${z}`}
              spawn={spawn}
              position={position}
              onPointerUp={() => onPointerTile?.(position)}
              onPointerEnter={() =>
                $onHoverTile({ point: position, type: "tile" })
              }
              onPointerLeave={() => $onHoverTile(null)}
            />
          ),
        );

        if (!spawn) {
          const renderNorthWall = isWallRenderable({
            layout,
            position: { x, z },
            direction: CrossDirection.EAST,
          });
          const renderEastWall = isWallRenderable({
            layout,
            position: { x, z },
            direction: CrossDirection.NORTH,
          });
          const renderNorthDoorWall = isDoorRenderable({
            layout,
            position: { x, z },
            direction: CrossDirection.EAST,
          });
          const renderEastDoorWall = isDoorRenderable({
            layout,
            position: { x, z },
            direction: CrossDirection.NORTH,
          });

          const $onClickWall =
            (direction: CrossDirection) => (point: Point2d) =>
              onClickWall?.(position, point, direction);

          const $onMoveWall = (direction: CrossDirection) => (point: Point2d) =>
            onMoveWall?.(position, point, direction);

          const $onLeaveWall = (direction: CrossDirection) => () =>
            onLeaveWall?.(direction);

          if (renderNorthWall)
            list.push(
              <PrivateRoomWallComponent
                key={`wall${x}.${z}-${CrossDirection.NORTH}`}
                direction={CrossDirection.NORTH}
                position={position}
                onPointerMove={$onMoveWall(CrossDirection.NORTH)}
                onPointerDown={$onClickWall(CrossDirection.NORTH)}
                onPointerLeave={$onLeaveWall(CrossDirection.NORTH)}
              />,
            );
          if (renderEastWall)
            list.push(
              <PrivateRoomWallComponent
                key={`wall${x}.${z}-${CrossDirection.EAST}`}
                direction={CrossDirection.EAST}
                position={position}
                onPointerMove={$onMoveWall(CrossDirection.EAST)}
                onPointerDown={$onClickWall(CrossDirection.EAST)}
                onPointerLeave={$onLeaveWall(CrossDirection.EAST)}
              />,
            );
          if (renderEastWall && renderNorthWall)
            list.push(
              <PrivateRoomWallComponent
                key={`wall${x}.${z}-corner`}
                direction="corner"
                position={position}
              />,
            );

          if (renderEastWall || renderNorthWall) {
            const target = currentWallPosition.y - WALL_HEIGHT;
            if (accumulatedPivot.y > target) accumulatedPivot.y = target;
          }

          const wallDoorDirection = renderNorthDoorWall
            ? CrossDirection.NORTH
            : CrossDirection.EAST;
          if (renderNorthDoorWall || renderEastDoorWall)
            list.push(
              <PrivateRoomWallComponent
                key={`wall${x}.${z}-door`}
                direction={wallDoorDirection}
                position={position}
                pivot={{
                  y: WALL_HEIGHT - WALL_DOOR_HEIGHT,
                }}
                height={WALL_DOOR_HEIGHT}
                onPointerMove={$onMoveWall(wallDoorDirection)}
                onPointerDown={$onClickWall(wallDoorDirection)}
                onPointerLeave={$onLeaveWall(wallDoorDirection)}
              />,
            );
        }
      }
    }

    return [list, accumulatedPivot];
  }, [
    layout,
    onPointerTile,
    $onHoverTile,
    onClickWall,
    onMoveWall,
    onLeaveWall,
  ]);

  useEffect(() => {
    setRawRoomSize((size) => $sizeRef?.current?.getSize?.() ?? size);
  }, [setRawRoomSize, tilesAndWalls]);

  const renderRoomSize = useMemo(
    () =>
      rawRoomSize.width && rawRoomSize.height ? null : (
        <ContainerComponent ref={$sizeRef} alpha={0}>
          {tilesAndWalls}
        </ContainerComponent>
      ),
    [tilesAndWalls, rawRoomSize],
  );

  const renderPreviewTile = useMemo(
    () =>
      previewData ? (
        <PrivateRoomTilePreview
          type={previewData.type}
          position={previewData.point}
          direction={previewData?.direction ?? CrossDirection.EAST}
        />
      ) : null,
    [previewData],
  );

  return useMemo(
    () => (
      <>
        <ContainerComponent
          ref={$ref}
          sortableChildren
          pivot={
            pivotFix
              ? pivot
              : {
                  x: TILE_SIZE.width / 2 + 1,
                  y: TILE_SIZE.height / 2,
                }
          }
        >
          {tilesAndWalls}
          {renderPreviewTile}
          {children}
        </ContainerComponent>
        {renderRoomSize}
      </>
    ),
    [
      pivot,
      tilesAndWalls,
      previewData,
      renderPreviewTile,
      children,
      renderRoomSize,
      pivotFix,
    ],
  );
};
