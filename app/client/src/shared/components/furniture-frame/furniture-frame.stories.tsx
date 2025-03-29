import { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";
import {
  FurnitureFrameComponent,
  FurnitureFrameComponentWrapper,
} from "./furniture-frame.component";
import { SBSmallRoomComponent, useSBFurniture } from ".storybook";
import { CrossDirection } from "shared/enums";
import { FurnitureData } from "shared/types";
import { DUMMY_FURNITURE_FRAME_DATA } from "shared/consts";

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
        position={{ x: -1, y: 0, z: 0 }}
        framePosition={{ x: 7, y: 45 }}
      />
    </SBSmallRoomComponent>
  );
};

//@ts-ignore
export const LoadingEast: Story = () => {
  return (
    <SBSmallRoomComponent>
      <FurnitureFrameComponentWrapper
        position={{ x: 0, y: 0, z: -1 }}
        framePosition={{ x: 7, y: 45 }}
        textures={
          DUMMY_FURNITURE_FRAME_DATA.direction[CrossDirection.EAST].textures
        }
      />
    </SBSmallRoomComponent>
  );
};

const LoadNorthComponent = () => {
  const { load, get } = useSBFurniture();

  const [furnitureData, setFurnitureData] = useState<FurnitureData>(null);

  useEffect(() => {
    const name = "./flags@pirate";
    load(name).then(() => setFurnitureData(get(name)));
  }, [load, get]);

  return (
    <SBSmallRoomComponent>
      <FurnitureFrameComponentWrapper
        position={{ x: -1, y: 0, z: 0 }}
        framePosition={{ x: 7, y: 45 }}
        spriteSheet={furnitureData?.spriteSheet}
        textures={furnitureData?.direction?.[CrossDirection.NORTH]?.textures}
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
        position={{ x: 0, y: 0, z: -1 }}
        framePosition={{ x: 7, y: 45 }}
        spriteSheet={furnitureData?.spriteSheet}
        textures={furnitureData?.direction?.[CrossDirection.EAST]?.textures}
      />
    </SBSmallRoomComponent>
  );
};

//@ts-ignore
export const LoadedEast: Story = () => <LoadEastComponent />;
