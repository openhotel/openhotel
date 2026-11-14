import { fn } from "@storybook/test";
import { NavItemComponent } from "./nav-item.component";

export default {
  title: "Components/Navigation/Item",
  component: NavItemComponent,
  parameters: {
    layout: "centered",
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    children: "Button",
  },
};

export const Selected = {
  args: {
    children: "Button",
  },
};
