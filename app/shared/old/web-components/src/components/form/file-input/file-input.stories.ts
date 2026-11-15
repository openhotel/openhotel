import { fn } from "@storybook/test";
import { FileInputComponent } from "./file-input.component";

export default {
  title: "Components/Form/File Input",
  component: FileInputComponent,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: { onChange: fn() },
};

export const Primary = {
  args: {
    placeholder: "placeholder",
    multiple: true,
    accept: ".zip",
  },
};
