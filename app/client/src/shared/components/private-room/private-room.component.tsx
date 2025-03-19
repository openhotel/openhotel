import React, { useMemo, useState } from "react";
import { ContainerComponent } from "@oh/pixi-components";
import { CrossDirection, RoomPointEnum } from "shared/enums";
import { isDoorRenderable, isWallRenderable } from "shared/utils";
import { Point3d, PrivateRoom } from "shared/types";
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
  onPointerTile?: (point: Point3d) => void;
  children?: React.ReactNode;
} & PrivateRoom;

export const PrivateRoomComponent: React.FC<Props> = ({
  layout,
  onPointerTile,
  children,
}) => {
  const [previewData, setPreviewData] = useState<{
    point: Point3d;
    type: "tile" | "stairs";
    direction?: CrossDirection.NORTH | CrossDirection.EAST;
  }>(null);

  const tilesAndWalls = useMemo(() => {
    const list = [];

    const roomSize = {
      width: Math.max(...layout.map((line) => line.length)),
      depth: layout.length,
    };

    for (let z = 0; z < roomSize.depth; z++) {
      const roomLine = layout[z];
      for (let x = 0; x < roomSize.width; x++) {
        if (roomLine[x] === RoomPointEnum.EMPTY) continue;

        const spawn = roomLine[x] === RoomPointEnum.SPAWN;
        const previewY = -((spawn ? 1 : (parseInt(roomLine[x] + "") ?? 1)) - 1);
        const y = Math.floor(previewY);
        const renderNorthStairs = roomLine[x] > roomLine[x - 1];
        const renderEastStairs = roomLine[x] > layout[z - 1]?.[x];

        const stairsDirection = renderNorthStairs
          ? CrossDirection.NORTH
          : CrossDirection.EAST;

        list.push(
          renderNorthStairs || renderEastStairs ? (
            <PrivateRoomStairs
              key={`stairs${x}.${z}`}
              position={{ x, y: y, z }}
              direction={stairsDirection}
              onPointerDown={() => onPointerTile?.({ x, y, z })}
              onPointerEnter={() =>
                setPreviewData({
                  point: { x, y, z },
                  type: "stairs",
                  direction: stairsDirection,
                })
              }
              onPointerLeave={() => setPreviewData(null)}
            />
          ) : (
            <PrivateRoomTile
              key={`tile${x}.${z}`}
              spawn={spawn}
              position={{ x, y, z }}
              onPointerDown={() => onPointerTile?.({ x, y, z })}
              onPointerEnter={() =>
                setPreviewData({ point: { x, y, z }, type: "tile" })
              }
              onPointerLeave={() => setPreviewData(null)}
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

          if (renderNorthWall)
            list.push(
              <PrivateRoomWallComponent
                key={`wall${x}.${z}-${CrossDirection.NORTH}`}
                direction={CrossDirection.NORTH}
                position={{
                  x,
                  z,
                  y,
                }}
              />,
            );
          if (renderEastWall)
            list.push(
              <PrivateRoomWallComponent
                key={`wall${x}.${z}-${CrossDirection.EAST}`}
                direction={CrossDirection.EAST}
                position={{
                  x,
                  z,
                  y,
                }}
              />,
            );
          if (renderEastWall && renderNorthWall)
            list.push(
              <PrivateRoomWallComponent
                key={`wall${x}.${z}-corner`}
                direction="corner"
                position={{
                  x,
                  z,
                  y,
                }}
              />,
            );

          if (renderNorthDoorWall || renderEastDoorWall)
            list.push(
              <PrivateRoomWallComponent
                key={`wall${x}.${z}-door`}
                direction={
                  renderNorthDoorWall
                    ? CrossDirection.NORTH
                    : CrossDirection.EAST
                }
                position={{
                  x,
                  z,
                  y,
                }}
                pivot={{
                  y: WALL_HEIGHT - WALL_DOOR_HEIGHT,
                }}
                height={WALL_DOOR_HEIGHT}
              />,
            );
        }
      }
    }

    return list;
  }, [layout, onPointerTile, setPreviewData]);

  const containerPivot = useMemo(() => {
    let topZIndex = Number.MAX_SAFE_INTEGER;
    let leftXIndex = Number.MIN_SAFE_INTEGER;

    for (let z = 0; z < layout.length; z++)
      for (let x = 0; x < layout[0].length; x++) {
        const roomPoint = layout[z][x] as unknown as number;
        if (
          (roomPoint as unknown) === RoomPointEnum.SPAWN ||
          (roomPoint as unknown) === RoomPointEnum.EMPTY
        )
          continue;
        let zIndex = x + z;
        let xIndex = -x + z;

        //top tile
        if (topZIndex >= zIndex) topZIndex = zIndex;

        //left tile
        if (xIndex >= leftXIndex) leftXIndex = xIndex;
      }

    return {
      x: -leftXIndex * (TILE_SIZE.width / 2) - WALL_WIDTH,
      y: topZIndex * (TILE_SIZE.height / 2) - WALL_HEIGHT,
    };
  }, [layout]);

  return (
    <ContainerComponent pivot={containerPivot} sortableChildren>
      {tilesAndWalls}
      {previewData ? (
        <PrivateRoomTilePreview
          type={previewData.type}
          position={previewData.point}
          direction={previewData?.direction ?? CrossDirection.EAST}
        />
      ) : null}
      {children}
    </ContainerComponent>
  );
};
