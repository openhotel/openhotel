import { Meta, StoryObj } from "@storybook/react";
import { NavigatorBarComponent } from "./navigator-bar.component";

export default {
  title: "Modules/Modals/Navigator/Navigator Bar",
  component: NavigatorBarComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof NavigatorBarComponent>;

type Story = StoryObj<typeof NavigatorBarComponent>;

export const Primary: Story = {};
