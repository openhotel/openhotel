import { fn } from "@storybook/test";
import { Button } from "./button.component";

export default {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    backgroundColor: { control: "color" },
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    label: "Button",
  },
};
