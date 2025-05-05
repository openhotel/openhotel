import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PrivateRoomTile } from "./tile.component";

export default {
  title: "Shared/Rooms/Private/Tile",
  component: PrivateRoomTile,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PrivateRoomTile>;

type Story = StoryObj<typeof PrivateRoomTile>;

//@ts-ignore
export const Primary: Story = () => {
  return (
    <PrivateRoomTile
      position={{
        x: 0,
        y: 0,
        z: 0,
      }}
    />
  );
};
