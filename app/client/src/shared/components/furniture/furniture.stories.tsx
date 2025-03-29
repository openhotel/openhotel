import { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useState } from "react";

import {
  FurnitureComponent,
  FurnitureComponentWrapper,
} from "./furniture.component";
import { SBSmallRoomComponent, useSBFurniture } from ".storybook";
import { FurnitureData } from "shared/types";
import { CrossDirection } from "shared/enums";

export default {
  title: "Shared/Furniture",
  component: FurnitureComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FurnitureComponent>;

type Story = StoryObj<typeof FurnitureComponent>;

//@ts-ignore
export const Loading: Story = () => {
  return (
    <SBSmallRoomComponent>
      <FurnitureComponentWrapper position={{ x: 0, y: 0, z: 0 }} />
    </SBSmallRoomComponent>
  );
};

const LoadComponent = () => {
  const { load, get } = useSBFurniture();

  const [furnitureData, setFurnitureData] = useState<FurnitureData>(null);

  useEffect(() => {
    const name = "./teleports@telephone";
    load(name).then(() => setFurnitureData(get(name)));
  }, [load, get]);

  return (
    <SBSmallRoomComponent>
      <FurnitureComponentWrapper
        position={{ x: 0, y: 0, z: 0 }}
        spriteSheet={furnitureData?.spriteSheet}
        textures={furnitureData?.direction?.[CrossDirection.NORTH]?.textures}
      />
    </SBSmallRoomComponent>
  );
};

//@ts-ignore
export const Load: Story = () => <LoadComponent />;
