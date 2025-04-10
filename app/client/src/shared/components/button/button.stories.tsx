import { Meta, StoryObj } from "@storybook/react";
import { ButtonComponent } from "./button.component";
import { GraphicsComponent, GraphicType } from "@oh/pixi-components";
import React from "react";

export default {
  title: "Shared/Button",
  component: ButtonComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof ButtonComponent>;

type Story = StoryObj<typeof ButtonComponent>;

//@ts-ignore
export const Text: Story = {
  args: {
    text: "test",
    color: 0x1,
    padding: [4, 8, 4, 8],
    position: {
      x: 10,
    },
  },
};

//@ts-ignore
export const Children: Story = {
  args: {
    padding: [3, 3, 3, 3],
    children: (
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={30}
        height={30}
        tint={0xff00ff}
        position={{
          x: 10,
        }}
        alpha={0.5}
      />
    ),
  },
};
