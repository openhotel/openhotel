import { Meta, StoryObj } from "@storybook/react";
import React, { useCallback, useEffect, useState } from "react";
import {
  FurnitureFrameComponent,
  FurnitureFrameComponentWrapper,
} from "./furniture-frame.component";
import { SBSmallRoomComponent, useSBFurniture } from ".storybook";
import { CrossDirection } from "shared/enums";
import { FurnitureData, Point2d, Point3d } from "shared/types";

export default {
  title: "Shared/Furniture/Frame",
  component: FurnitureFrameComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FurnitureFrameComponent>;

type Story = StoryObj<typeof FurnitureFrameComponent>;

//@ts-ignore
export const LoadingNorth: Story = () => {
  return (
    <SBSmallRoomComponent>
      <FurnitureFrameComponentWrapper
        position={{ x: -1, y: 0, z: -1 }}
        framePosition={{ x: 0, y: 0 }}
        onPointerDown={console.log}
      />
    </SBSmallRoomComponent>
  );
};

//@ts-ignore
export const LoadingEast: Story = () => {
  return (
    <SBSmallRoomComponent>
      <FurnitureFrameComponentWrapper
        position={{ x: -1, y: 0, z: -1 }}
        framePosition={{ x: 0, y: 0 }}
        direction={CrossDirection.EAST}
        onPointerDown={console.log}
      />
    </SBSmallRoomComponent>
  );
};

const LoadNorthComponent = () => {
  const { load, get } = useSBFurniture();

  const [furnitureData, setFurnitureData] = useState<FurnitureData>(null);

  const [tilePosition, setTilePosition] = useState<Point3d>({
    x: -1,
    y: 0,
    z: -1,
  });
  const [framePosition, setFramePosition] = useState<Point2d>({ x: 0, y: 0 });
  const [direction, setDirection] = useState<CrossDirection>(
    CrossDirection.NORTH,
  );

  useEffect(() => {
    const name = "./flags@pirate";
    load(name).then(() => setFurnitureData(get(name)));
  }, [load, get]);

  const onClickWall = useCallback(
    (tilePosition: Point3d, wallPoint: Point2d, direction: CrossDirection) => {
      setTilePosition(tilePosition);
      setFramePosition(wallPoint);
      setDirection(direction);
    },
    [setTilePosition, setFramePosition, setDirection],
  );

  return (
    <SBSmallRoomComponent onClickWall={onClickWall}>
      <FurnitureFrameComponentWrapper
        position={tilePosition}
        framePosition={framePosition}
        data={furnitureData}
        direction={direction as any}
        onPointerDown={console.log}
      />
    </SBSmallRoomComponent>
  );
};

//@ts-ignore
export const LoadedNorth: Story = () => <LoadNorthComponent />;

const LoadEastComponent = () => {
  const { load, get } = useSBFurniture();

  const [furnitureData, setFurnitureData] = useState<FurnitureData>(null);

  useEffect(() => {
    const name = "./flags@pirate";
    load(name).then(() => setFurnitureData(get(name)));
  }, [load, get]);

  return (
    <SBSmallRoomComponent>
      <FurnitureFrameComponentWrapper
        position={{ x: -1, y: 0, z: -1 }}
        framePosition={{ x: 0, y: 0 }}
        data={furnitureData}
        direction={CrossDirection.EAST}
        onPointerDown={console.log}
      />
    </SBSmallRoomComponent>
  );
};

//@ts-ignore
export const LoadedEast: Story = () => <LoadEastComponent />;
