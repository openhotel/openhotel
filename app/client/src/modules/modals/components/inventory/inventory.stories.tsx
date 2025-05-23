import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { InventoryComponent } from "./inventory.component";

export default {
  title: "Modules/Modals/Inventory",
  component: InventoryComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof InventoryComponent>;

type Story = StoryObj<typeof InventoryComponent>;

//@ts-ignore
export const Inventory: Story = () => {
  return <InventoryComponent />;
};
