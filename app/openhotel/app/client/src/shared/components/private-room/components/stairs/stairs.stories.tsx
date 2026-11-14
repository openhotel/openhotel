import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PrivateRoomStairs } from "./stairs.component";
import { CrossDirection } from "shared/enums";

export default {
  title: "Shared/Rooms/Private/Stairs",
  component: PrivateRoomStairs,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PrivateRoomStairs>;

type Story = StoryObj<typeof PrivateRoomStairs>;

export const NorthStairs: Story = () => {
  return (
    <PrivateRoomStairs
      direction={CrossDirection.NORTH}
      position={{
        x: 0,
        y: -1,
        z: 0,
      }}
    />
  );
};

export const EastStairs: Story = () => {
  return (
    <PrivateRoomStairs
      direction={CrossDirection.EAST}
      position={{
        x: 0,
        y: -1,
        z: 0,
      }}
    />
  );
};
