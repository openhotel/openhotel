import { fn } from "@storybook/test";
import { ButtonComponent } from "./button.component";

export default {
  title: "Components/Form/Button",
  component: ButtonComponent,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    children: "Button",
  },
};

export const ThreeDimensions = {
  args: {
    children: "Button",
    buttonType: "3d",
  },
};
