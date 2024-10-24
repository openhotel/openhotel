import { fn } from "@storybook/test";
import { Header } from "./header.component";

export default {
  title: "Components/Header",
  component: Header,
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
