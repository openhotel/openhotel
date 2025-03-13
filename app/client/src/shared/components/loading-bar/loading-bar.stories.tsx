import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LoadingBarComponent } from "./loading-bar.component";

export default {
  title: "Shared/Loading Bar",
  component: LoadingBarComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof LoadingBarComponent>;

type Story = StoryObj<typeof LoadingBarComponent>;

export const Primary: Story = () => {
  return <LoadingBarComponent width={50} height={10} percentage={0.76} />;
};
