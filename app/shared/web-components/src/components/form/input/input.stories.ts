import { fn } from "@storybook/test";
import { InputComponent } from "./input.component";

export default {
  title: "Components/Form/Input",
  component: InputComponent,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: { onChange: fn() },
};

export const Primary = {
  args: {
    placeholder: "placeholder",
  },
};

export const Disabled = {
  args: {
    placeholder: "placeholder",
    value: "test",
    disabled: true,
  },
};
