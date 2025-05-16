import { Meta, StoryObj } from "@storybook/react";
import { TitleComponent } from "./title.component";
import { InputComponent } from "shared/components";
import React from "react";

export default {
  title: "Shared/Form/Title",
  component: TitleComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
} as Meta<typeof TitleComponent>;

type Story = StoryObj<typeof TitleComponent>;

//@ts-ignore
export const Title: Story = {
  args: {
    position: {
      x: 10,
      y: 10,
    },
    title: "Title gp123",
    titleProps: {
      padding: {
        left: 6,
      },
    },
    children: <InputComponent size={{ height: 10, width: 80 }} />,
  },
};
