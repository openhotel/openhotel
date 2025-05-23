import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CatalogComponent } from "./catalog.component";

export default {
  title: "Modules/Modals/Catalog",
  component: CatalogComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof CatalogComponent>;

type Story = StoryObj<typeof CatalogComponent>;

//@ts-ignore
export const Catalog: Story = () => {
  return <CatalogComponent />;
};
