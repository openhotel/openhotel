import { Meta, StoryObj } from "@storybook/react";
import { BubbleMessageComponent } from "./bubble-message.component";

export default {
  title: "Shared/Bubble Message",
  component: BubbleMessageComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof BubbleMessageComponent>;

type Story = StoryObj<typeof BubbleMessageComponent>;

//@ts-ignore
export const Primary: Story = {
  args: {
    username: "pagoru",
    message: "This is a test message!",
  },
};

//@ts-ignore
export const Colored: Story = {
  args: {
    username: "pagoru",
    message: "This is a test message!",
    backgroundColor: 0xcccccc,
    borderColor: 0x333333,
    messageColor: 0xcc33cc,
  },
};
