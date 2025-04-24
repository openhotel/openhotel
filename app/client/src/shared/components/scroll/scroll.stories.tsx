import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { ScrollComponent } from "./scroll.component";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
} from "@openhotel/pixi-components";

export default {
  title: "Shared/Scroll",
  component: ScrollComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof ScrollComponent>;

type Story = StoryObj<typeof ScrollComponent>;

//@ts-ignore
export const Primary: Story = {
  args: {
    size: {
      width: 100,
      height: 100,
    },
    scrollHeight: 70,
    children: (
      <ContainerComponent>
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={100}
          height={90}
          tint={0xff00ff}
        />
        <GraphicsComponent
          type={GraphicType.RECTANGLE}
          width={100}
          height={80}
          tint={0xffff00}
          position={{
            y: 90,
          }}
        />
      </ContainerComponent>
    ),
  },
};
