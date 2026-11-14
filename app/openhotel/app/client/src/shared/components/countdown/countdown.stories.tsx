import { Meta, StoryObj } from "@storybook/react";

import { CountdownComponent } from "./countdown.component";

export default {
  title: "Shared/Countdown",
  component: CountdownComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof CountdownComponent>;

type Story = StoryObj<typeof CountdownComponent>;

//@ts-ignore
export const Countdown: Story = {
  args: {
    count: 5,
    color: 0xff00ff,
    onDone: () => console.log("on done!"),
  },
};
