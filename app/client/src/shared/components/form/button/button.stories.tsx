import { Meta, StoryObj } from "@storybook/react";
import { ButtonComponent } from "./button.component";

export default {
  title: "Shared/Form/Button",
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
    position: {
      x: 10,
    },
    size: {
      width: 40,
      height: 20,
    },
  },
};
