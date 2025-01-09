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
      {
        key: 6,
        value: "One",
      },
      {
        key: 5,
        value: "Two or something something",
      },
      {
        key: 3,
        value: "Threeeee",
      },
    ],
    defaultOption: 4,
  },
};
