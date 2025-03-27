import React, { useMemo } from "react";
import { CrossDirection } from "../shared/enums";
import { Point2d } from "../shared/types";
import { ContainerComponent, ContainerProps } from "@oh/pixi-components";
import {
  PrivateRoomTile,
  PrivateRoomWallComponent,
} from "../shared/components/private-room/components";

type Props = {
  position: Point2d;
  children: React.ReactNode;
} & ContainerProps;

export const SmallRoomComponent: React.FC<Props> = ({ children, ...props }) => {
  const renderWalls = useMemo(
    () =>
      [0, 1, 2].map((index) => (
        <PrivateRoomWallComponent
          key={`wall_${index}`}
          direction={CrossDirection.NORTH}
          position={{ x: 0, y: 0, z: -index }}
        />
      )),
    [],
  );

  const renderTiles = useMemo(() => {
    let list = [];
    for (let x = 0; x < 3; x++) {
      for (let z = -2; z < 1; z++) {
        list.push(<PrivateRoomTile position={{ x, y: 0, z }} />);
      }
    }
    return list;
  }, []);

  return (
    <ContainerComponent {...props}>
      {children}
      {renderTiles}
      {renderWalls}
    </ContainerComponent>
  );
};
