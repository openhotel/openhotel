import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  FurnitureFrameComponent,
  FurnitureFrameComponentWrapper,
} from "./furniture-frame.component";
import { SmallRoomComponent } from ".storybook";

export default {
  title: "Shared/Furniture/Frame",
  component: FurnitureFrameComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FurnitureFrameComponent>;

type Story = StoryObj<typeof FurnitureFrameComponent>;

//@ts-ignore
export const Frame: Story = () => {
  return (
    <SmallRoomComponent position={{ x: 10, y: 120 }}>
      <FurnitureFrameComponentWrapper
        position={{ x: 0, y: 0, z: 0 }}
        framePosition={{ x: 19, y: 45 }}
      />
    </SmallRoomComponent>
  );
};
