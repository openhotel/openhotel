import { Meta, StoryObj } from "@storybook/react";
import { NavigatorButtonComponent } from "./navigator-button.component";

export default {
  title: "Modules/Modals/Navigator/Button",
  component: NavigatorButtonComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof NavigatorButtonComponent>;

type Story = StoryObj<typeof NavigatorButtonComponent>;

export const Primary: Story = {
  args: {
    type: "left",
    selected: true,
    text: "Hotel",
  },
};
