import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import { FurnitureComponent } from "./furniture.component";
import { SmallRoomComponent } from ".storybook/__components__";
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
export const Loading: Story = () => (
  <SmallRoomComponent>
    <FurnitureComponent position={{ x: 0, y: 0, z: 0 }} />
  </SmallRoomComponent>
);

//@ts-ignore
export const Load: Story = () => (
  <SmallRoomComponent>
    <FurnitureComponent
      position={{ x: 0, y: 0, z: 0 }}
      furnitureId="toys@octopus-0"
      direction={CrossDirection.NORTH}
    />
  </SmallRoomComponent>
);

//@ts-ignore
export const LoadMultiple: Story = () => (
  <SmallRoomComponent>
    <FurnitureComponent
      position={{ x: 0, y: 0, z: 0 }}
      furnitureId="teleports@telephone"
      direction={CrossDirection.NORTH}
    />
    <FurnitureComponent
      position={{ x: 0, y: 74, z: 0 }}
      furnitureId="toys@octopus-0"
      direction={CrossDirection.NORTH}
    />
  </SmallRoomComponent>
);
