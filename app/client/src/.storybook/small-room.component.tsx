import React, { useMemo } from "react";
import { CrossDirection } from "../shared/enums";
import { ContainerComponent, ContainerProps } from "@oh/pixi-components";
import {
  PrivateRoomTile,
  PrivateRoomWallComponent,
} from "../shared/components/private-room/components";

type Props = {
  direction?: CrossDirection.NORTH | CrossDirection.EAST;
  children: React.ReactNode;
} & ContainerProps;

export const SmallRoomComponent: React.FC<Props> = ({
  children,
  direction = CrossDirection.NORTH,
  ...props
}) => {
  const renderWalls = useMemo(
    () =>
      [0, 1, 2].map((index) => (
        <PrivateRoomWallComponent
          key={`wall_${index}`}
          direction={direction}
          position={{
            x: direction === CrossDirection.EAST ? -index + 1 : -1,
            y: 0,
            z: direction === CrossDirection.NORTH ? -index + 1 : -1,
          }}
        />
      )),
    [direction],
  );

  const renderTiles = useMemo(() => {
    let list = [];
    for (let x = -1; x < 2; x++) {
      for (let z = -1; z < 2; z++) {
        list.push(<PrivateRoomTile position={{ x, y: 0, z }} />);
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
    </ContainerComponent>
  );
};
