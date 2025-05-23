import { Meta, StoryObj } from "@storybook/react";
import React, { useCallback, useState } from "react";
import { FurnitureFrameComponent } from "./furniture-frame.component";
import { SmallRoomComponent } from ".storybook/__components__";
import { CrossDirection } from "shared/enums";
import { Point2d, Point3d } from "shared/types";

export default {
  title: "Shared/Furniture/Frame",
  component: FurnitureFrameComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FurnitureFrameComponent>;

type Story = StoryObj<typeof FurnitureFrameComponent>;

//@ts-ignore
export const LoadingNorth: Story = () => (
  <SmallRoomComponent>
    <FurnitureFrameComponent
      position={{ x: -1, y: 0, z: -1 }}
      framePosition={{ x: 0, y: 0 }}
      onPointerDown={console.log}
    />
  </SmallRoomComponent>
);

//@ts-ignore
export const LoadingEast: Story = () => (
  <SmallRoomComponent>
    <FurnitureFrameComponent
      position={{ x: -1, y: 0, z: -1 }}
      framePosition={{ x: 0, y: 0 }}
      direction={CrossDirection.EAST}
      onPointerDown={console.log}
    />
  </SmallRoomComponent>
);

//@ts-ignore
export const LoadedNorth: Story = () => {
  const [tilePosition, setTilePosition] = useState<Point3d>({
    x: -1,
    y: 0,
    z: -1,
  });
  const [framePosition, setFramePosition] = useState<Point2d>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<CrossDirection>(
    CrossDirection.NORTH,
  );

  const onClickWall = useCallback(
    (tilePosition: Point3d, wallPoint: Point2d, direction: CrossDirection) => {
      setTilePosition(tilePosition);
      setFramePosition(wallPoint);
      setDirection(direction);
    },
    [setTilePosition, setFramePosition, setDirection],
  );

  return (
    <SmallRoomComponent onClickWall={onClickWall}>
      <FurnitureFrameComponent
        position={tilePosition}
        framePosition={framePosition}
        furnitureId="flags@pirate"
        direction={direction as any}
        onPointerDown={console.log}
      />
    </SmallRoomComponent>
  );
};

//@ts-ignore
export const LoadedEast: Story = () => (
  <SmallRoomComponent>
    <FurnitureFrameComponent
      position={{ x: -1, y: 0, z: -1 }}
      framePosition={{ x: 0, y: 0 }}
      furnitureId="flags@pirate"
      direction={CrossDirection.EAST}
      onPointerDown={console.log}
    />
  </SmallRoomComponent>
);
