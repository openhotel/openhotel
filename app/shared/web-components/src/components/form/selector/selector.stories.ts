import { fn } from "@storybook/test";
import { SelectorComponent } from "./selector.component";

export default {
  title: "Components/Form/Selector",
  component: SelectorComponent,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    placeholder: "placeholder",
    options: [
      { key: 1, value: "One" },
      { key: 2, value: "Two or something something" },
      { key: 3, value: "Threeeee" },
    ],
  },
};
