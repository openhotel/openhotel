import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NavigatorComponent } from "./navigator.component";

export default {
  title: "Modules/Modals/Navigator",
  component: NavigatorComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof NavigatorComponent>;

type Story = StoryObj<typeof NavigatorComponent>;

export const Primary: Story = () => {
  return <NavigatorComponent />;
};
