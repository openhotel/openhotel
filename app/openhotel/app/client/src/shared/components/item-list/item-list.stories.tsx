import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ItemListComponent } from "./item-list.component";
import { GraphicsComponent, GraphicType } from "@openhotel/pixi-components";

export default {
  title: "Shared/Item List",
  component: ItemListComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof ItemListComponent>;

type Story = StoryObj<typeof ItemListComponent>;

//@ts-ignore
export const Primary: Story = () => {
  return (
    <ItemListComponent
      rows={7}
      cols={3}
      onSelect={console.log}
      items={[
        {
          key: "1",
          render: () => (
            <GraphicsComponent
              type={GraphicType.CIRCLE}
              radius={11}
              tint={0xff00ff}
            />
          ),
        },
        {
          key: "2",
          render: () => (
            <GraphicsComponent
              type={GraphicType.CIRCLE}
              radius={11}
              tint={0xffff00}
            />
          ),
        },
        {
          key: "3",
          render: () => (
            <GraphicsComponent
              type={GraphicType.CIRCLE}
              radius={11}
              tint={0x00ffff}
            />
          ),
        },
        {
          key: "4",
          render: () => (
            <GraphicsComponent
              type={GraphicType.CIRCLE}
              radius={11}
              tint={0xf00fff}
            />
          ),
        },
      ]}
    />
  );
};

//@ts-ignore
export const WithScroll: Story = () => {
  return (
    <ItemListComponent
      rows={7}
      cols={7}
      height={150}
      onSelect={console.log}
      items={[
        {
          key: "1",
          render: () => (
            <GraphicsComponent
              type={GraphicType.CIRCLE}
              radius={11}
              tint={0xff00ff}
            />
          ),
        },
      ]}
    />
  );
};
