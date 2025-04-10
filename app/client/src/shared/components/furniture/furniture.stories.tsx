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
    // const name = "./toys@octopus-0";
    const name = "teleports@telephone";
    load(name).then(() => setFurnitureData(get(name)));
  }, [load, get]);

  return (
    <SBSmallRoomComponent>
      <FurnitureComponentWrapper
        position={{ x: 0, y: 0, z: 0 }}
        data={furnitureData}
        direction={CrossDirection.NORTH}
      />
    </SBSmallRoomComponent>
  );
};

//@ts-ignore
export const Load: Story = () => <LoadComponent />;

const LoadMultipleComponent = () => {
  const { load, get } = useSBFurniture();

  const [furnitureData1, setFurnitureData1] = useState<FurnitureData>(null);
  const [furnitureData2, setFurnitureData2] = useState<FurnitureData>(null);

  useEffect(() => {
    load("teleports@telephone").then(() =>
      setFurnitureData1(get("teleports@telephone")),
    );
    load("./toys@octopus-0").then(() =>
      setFurnitureData2(get("./toys@octopus-0")),
    );
  }, [load, get]);

  return (
    <SBSmallRoomComponent>
      <FurnitureComponentWrapper
        position={{ x: 0, y: 0, z: 0 }}
        data={furnitureData1}
        direction={CrossDirection.NORTH}
      />
      <FurnitureComponentWrapper
        position={{ x: 0, y: 74, z: 0 }}
        data={furnitureData2}
        direction={CrossDirection.NORTH}
      />
    </SBSmallRoomComponent>
  );
};

//@ts-ignore
export const LoadMultiple: Story = () => <LoadMultipleComponent />;
