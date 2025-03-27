import { Meta, StoryObj } from "@storybook/react";
import React from "react";

import {
  FurnitureComponent,
  FurnitureComponentWrapper,
} from "./furniture.component";
import { SmallRoomComponent } from ".storybook";

export default {
  title: "Shared/Furniture",
  component: FurnitureComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FurnitureComponent>;

type Story = StoryObj<typeof FurnitureComponent>;

//@ts-ignore
export const Furniture: Story = () => {
  return (
    <SmallRoomComponent position={{ x: 10, y: 120 }}>
      <FurnitureComponentWrapper position={{ x: 1, y: 0, z: -1 }} />
    </SmallRoomComponent>
  );
};
