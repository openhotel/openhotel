import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PurseComponent } from "./purse.component";

export default {
  title: "Modules/Modals/Purse",
  component: PurseComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PurseComponent>;

type Story = StoryObj<typeof PurseComponent>;

//@ts-ignore
export const Purse: Story = () => {
  return <PurseComponent />;
};
