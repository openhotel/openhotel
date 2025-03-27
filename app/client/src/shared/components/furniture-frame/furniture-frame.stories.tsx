import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  FurnitureFrameComponent,
  FurnitureFrameComponentWrapper,
} from "./furniture-frame.component";
import { SmallRoomComponent } from ".storybook";
import { CrossDirection } from "shared/enums";

export default {
  title: "Shared/Furniture/Frame",
  component: FurnitureFrameComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FurnitureFrameComponent>;

type Story = StoryObj<typeof FurnitureFrameComponent>;

//@ts-ignore
export const North: Story = () => {
  return (
    <SmallRoomComponent>
      <FurnitureFrameComponentWrapper
        position={{ x: -1, y: 0, z: 0 }}
        framePosition={{ x: 7, y: 45 }}
      />
    </SmallRoomComponent>
  );
};

//@ts-ignore
export const East: Story = () => {
  return (
    <SmallRoomComponent direction={CrossDirection.EAST}>
      <FurnitureFrameComponentWrapper
        position={{ x: 0, y: 0, z: -1 }}
        framePosition={{ x: 7, y: 45 }}
        direction={CrossDirection.EAST}
      />
    </SmallRoomComponent>
  );
};
