import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CameraProvider, ModalProvider } from "shared/hooks";
import { CatalogComponent } from "./catalog.component";

export default {
  title: "Modules/Modals/Catalog",
  component: CatalogComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof CatalogComponent>;

type Story = StoryObj<typeof CatalogComponent>;

//@ts-ignore
export const Primary: Story = () => {
  return (
    <CameraProvider>
      <ModalProvider>
        <CatalogComponent />
      </ModalProvider>
    </CameraProvider>
  );
};
