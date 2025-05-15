import { Meta, StoryObj } from "@storybook/react";
import { InputComponent } from "./input.component";
import { SpriteSheetEnum } from "shared/enums";
import { SpriteComponent } from "@openhotel/pixi-components";
import React from "react";
import { fn } from "@storybook/test";

export default {
  title: "Shared/Form/Input",
  component: InputComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
} as Meta<typeof InputComponent>;

type Story = StoryObj<typeof InputComponent>;

//@ts-ignore
export const Input: Story = {
  args: {
    size: {
      width: 80,
      height: 20,
    },
    placeholder: "Name",
    value: "pagoru",
    onChange: fn(),
  },
};
//@ts-ignore
export const SearchInput: Story = {
  args: {
    size: {
      width: 80,
      height: 20,
    },
    padding: {
      left: 22,
    },
    placeholder: "Search",
    onChange: fn(),
    children: (
      <SpriteComponent
        spriteSheet={SpriteSheetEnum.UI}
        texture="search-bubble-icon"
        position={{
          x: 1,
          y: 1,
        }}
      />
    ),
  },
};
