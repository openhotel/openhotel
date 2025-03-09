import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ModalProvider } from "shared/hooks";
import { CatalogComponent } from "./catalog.component";

export default {
  title: "Modules/Modals/Catalog",
  component: CatalogComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof CatalogComponent>;

type Story = StoryObj<typeof CatalogComponent>;

export const Primary: Story = () => {
  return (
    <ModalProvider>
      <CatalogComponent />
    </ModalProvider>
  );
};
