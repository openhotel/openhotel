import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PrivateRoomWallComponent } from "./wall.component";
import { CrossDirection } from "shared/enums";
import {
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";

export default {
  title: "Shared/Rooms/Private/Wall",
  component: PrivateRoomWallComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PrivateRoomWallComponent>;

type Story = StoryObj<typeof PrivateRoomWallComponent>;

export const NorthWall: Story = () => {
  return (
    <FlexContainerComponent
      justify={FLEX_JUSTIFY.CENTER}
      align={FLEX_ALIGN.CENTER}
    >
      <PrivateRoomWallComponent
        direction={CrossDirection.NORTH}
        tint={0xc4d3dd}
        position={{
          x: 0,
          y: 0,
          z: 0,
        }}
      />
    </FlexContainerComponent>
  );
};

export const EastWall: Story = () => {
  return (
    <FlexContainerComponent
      justify={FLEX_JUSTIFY.CENTER}
      align={FLEX_ALIGN.CENTER}
    >
      <PrivateRoomWallComponent
        direction={CrossDirection.EAST}
        tint={0xc4d3dd}
        position={{
          x: 0,
          y: 0,
          z: 0,
        }}
      />
    </FlexContainerComponent>
  );
};

export const CornerWall: Story = () => {
  return (
    <FlexContainerComponent
      justify={FLEX_JUSTIFY.CENTER}
      align={FLEX_ALIGN.CENTER}
    >
      <PrivateRoomWallComponent
        direction="corner"
        tint={0xc4d3dd}
        position={{
          x: 0,
          y: 0,
          z: 0,
        }}
      />
    </FlexContainerComponent>
  );
};
