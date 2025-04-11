import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PrivateRoomWallComponent } from "./wall.component";
import { CrossDirection } from "shared/enums";
import {
  ContainerComponent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@openhotel/pixi-components";

export default {
  title: "Shared/Rooms/Private/Wall",
  component: PrivateRoomWallComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PrivateRoomWallComponent>;

type Story = StoryObj<typeof PrivateRoomWallComponent>;

//@ts-ignore
export const NorthWall: Story = () => {
  return (
    <ContainerComponent
      position={{
        x: 10,
        y: 100,
      }}
    >
      <PrivateRoomWallComponent
        direction={CrossDirection.NORTH}
        tint={0xc4d3dd}
        position={{
          x: 0,
          y: 0,
          z: 0,
        }}
        onPointerDown={console.log}
      />
    </ContainerComponent>
  );
};

//@ts-ignore
export const EastWall: Story = () => {
  return (
    <ContainerComponent
      position={{
        x: 0,
        y: 100,
      }}
    >
      <PrivateRoomWallComponent
        direction={CrossDirection.EAST}
        tint={0xc4d3dd}
        position={{
          x: 0,
          y: 0,
          z: 0,
        }}
        onPointerDown={console.log}
      />
    </ContainerComponent>
  );
};

//@ts-ignore
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
