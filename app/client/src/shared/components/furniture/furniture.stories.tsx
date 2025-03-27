import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import {
  FurnitureComponent,
  FurnitureComponentWrapper,
} from "./furniture.component";
import { SmallRoomComponent } from ".storybook";
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
export const North: Story = () => {
  return (
    <SmallRoomComponent>
      <FurnitureComponentWrapper position={{ x: 0, y: 0, z: 0 }} />
    </SmallRoomComponent>
  );
};

//@ts-ignore
export const East: Story = () => {
  return (
    <SmallRoomComponent direction={CrossDirection.EAST}>
      <FurnitureComponentWrapper position={{ x: 0, y: 0, z: 0 }} />
    </SmallRoomComponent>
  );
};
