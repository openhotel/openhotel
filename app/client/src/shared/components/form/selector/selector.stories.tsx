import { Meta, StoryObj } from "@storybook/react";
import { SelectorComponent } from "./selector.component";
import { fn } from "@storybook/test";

export default {
  title: "Shared/Form/Selector",
  component: SelectorComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
} as Meta<typeof SelectorComponent>;

type Story = StoryObj<typeof SelectorComponent>;

//@ts-ignore
export const Selector: Story = {
  args: {
    size: {
      width: 80,
      height: 20,
    },
    options: [
      {
        key: "0",
        value: "option 1",
      },
      {
        key: "1",
        value: "option 2",
      },
      {
        key: "2",
        value: "option 3",
      },
      {
        key: "3",
        value: "option 4",
      },
      {
        key: "4",
        value: "option 5",
      },
      {
        key: "5",
        value: "option 6",
      },
    ],
    onChange: fn(),
    position: {
      x: 10,
    },
  },
};
