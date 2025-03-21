import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ContainerComponent } from "@oh/pixi-components";
import { PrivateRoomTile } from "shared/components/private-room/components";

import { FurnitureComponent } from "./furniture.component";

export default {
  title: "Shared/Furniture",
  component: FurnitureComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof FurnitureComponent>;

type Story = StoryObj<typeof FurnitureComponent>;

export const Furniture: Story = () => {
  return (
    <ContainerComponent
      position={{
        y: 55,
      }}
    >
      <FurnitureComponent position={{ x: 1, y: 0, z: 0 }} />
      <PrivateRoomTile position={{ x: 0, y: 0, z: 0 }} />
    </ContainerComponent>
  );
};
