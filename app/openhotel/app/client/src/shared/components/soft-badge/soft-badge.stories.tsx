import { Meta, StoryObj } from "@storybook/react";
import { SoftBadgeComponent } from "./soft-badge.component";

export default {
  title: "Shared/Soft Badge",
  component: SoftBadgeComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof SoftBadgeComponent>;

type Story = StoryObj<typeof SoftBadgeComponent>;

//@ts-ignore
export const SoftBadge: Story = {
  args: {
    size: {
      width: 100,
      height: 20,
    },
  },
};
