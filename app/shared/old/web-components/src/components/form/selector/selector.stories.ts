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
    defaultOption: {
      key: 3,
      value: "Threeeee",
    },
  },
};

export const NonClearable = {
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
    defaultOption: {
      key: 3,
      value: "Threeeee",
    },
    clearable: false,
  },
};

export const Long = {
  args: {
    placeholder: "placeholder",
    options: [
      {
        key: 1,
        value: "One",
      },
      {
        key: 2,
        value: "Two or something something",
      },
      {
        key: 3,
        value: "Threeeee",
      },
      {
        key: 4,
        value: "One",
      },
      {
        key: 5,
        value: "Two or something something",
      },
      {
        key: 6,
        value: "Threeeee",
      },
      {
        key: 7,
        value: "One",
      },
      {
        key: 8,
        value: "Two or something something",
      },
      {
        key: 9,
        value: "Threeeee",
      },
      {
        key: 10,
        value: "One",
      },
      {
        key: 11,
        value: "Two or something something",
      },
      {
        key: 12,
        value: "Threeeee",
      },
      {
        key: 13,
        value: "One",
      },
      {
        key: 14,
        value: "Two or something something",
      },
      {
        key: 15,
        value: "Threeeee",
      },
      {
        key: 16,
        value: "Two or something something",
      },
      {
        key: 17,
        value: "Threeeee",
      },
      {
        key: 18,
        value: "One",
      },
      {
        key: 19,
        value: "Two or something something",
      },
      {
        key: 20,
        value: "Threeeee",
      },
    ],
    defaultOption: {
      key: 3,
      value: "Threeeee",
    },
  },
};
