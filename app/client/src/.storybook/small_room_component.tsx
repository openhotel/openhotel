import React, { useMemo } from "react";
import { CrossDirection } from "../shared/enums";
import { ContainerComponent, ContainerProps } from "@openhotel/pixi-components";
import {
  PrivateRoomTile,
  PrivateRoomWallComponent,
} from "../shared/components/private-room/components";
import { Point2d, Point3d } from "shared/types";

type Props = {
  children: React.ReactNode;
  onClickWall?: (
    tilePosition: Point3d,
    wallPoint: Point2d,
    direction: CrossDirection,
  ) => void;
} & ContainerProps;

export const SBSmallRoomComponent: React.FC<Props> = ({
  children,
  onClickWall,
  ...props
}) => {
  const renderWalls = useMemo(
    () =>
      [0, 1, 2].map((index) => (
        <React.Fragment key={`wall_${index}`}>
          <PrivateRoomWallComponent
            direction={CrossDirection.NORTH}
            position={{
              x: -1,
              y: 0,
              z: -index + 1,
            }}
            onPointerDown={(wallPoint: Point2d) =>
              onClickWall?.(
                {
                  x: -1,
                  y: 0,
                  z: -index + 1,
                },
                wallPoint,
                CrossDirection.NORTH,
              )
            }
          />
          <PrivateRoomWallComponent
            direction={CrossDirection.EAST}
            position={{
              x: -index + 1,
              y: 0,
              z: -1,
            }}
            onPointerDown={(wallPoint: Point2d) =>
              onClickWall?.(
                {
                  x: -index + 1,
                  y: 0,
                  z: -1,
                },
                wallPoint,
                CrossDirection.EAST,
              )
            }
          />
        </React.Fragment>
      )),
    [onClickWall],
  );

  const renderTiles = useMemo(() => {
    let list = [];
    for (let x = -1; x < 2; x++) {
      for (let z = -1; z < 2; z++) {
        list.push(
          <PrivateRoomTile key={`tile_${x}.${z}`} position={{ x, y: 0, z }} />,
        );
      }
    }
    return list;
  }, []);

  return (
    <ContainerComponent
      {...props}
      position={{
        x: 55,
        y: 125,
      }}
    >
      {children}
      {renderTiles}
      {renderWalls}

      <PrivateRoomWallComponent
        direction="corner"
        position={{
          x: -1,
          y: 0,
          z: -1,
        }}
      />
    </ContainerComponent>
  );
};
