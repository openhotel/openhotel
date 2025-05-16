import { Meta, StoryObj } from "@storybook/react";
import { ItemComponent } from "shared/components/form/item/item.component";
import React from "react";
import { TextComponent } from "shared/components/text";

export default {
  title: "Shared/Form/Item",
  component: ItemComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
} as Meta<typeof ItemComponent>;

type Story = StoryObj<typeof ItemComponent>;

//@ts-ignore
export const Item: Story = {
  args: {
    // position: {
    //   x: 100,
    //   y: 100,
    // },
    size: {
      width: 100,
      height: 100,
    },
    color: "blue",
    children: <TextComponent text={"test"} color={0} />,
  },
};
