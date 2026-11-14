import { Meta, StoryObj } from "@storybook/react";
import { BubbleActionComponent } from "./bubble-action.component";

export default {
  title: "Shared/Character/Bubble Action",
  component: BubbleActionComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof BubbleActionComponent>;

type Story = StoryObj<typeof BubbleActionComponent>;

//@ts-ignore
export const Primary: Story = {
  args: {
    text: "...",
    padding: {
      top: 0,
      right: 3,
      left: 3,
      bottom: 3,
    },
  },
};
