import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CameraProvider, ModalProvider } from "shared/hooks";
import { CatalogComponentWrapper } from "./catalog.component";
import { DragContainerProvider } from "@openhotel/pixi-components";

export default {
  title: "Modules/Modals/Catalog",
  component: CatalogComponentWrapper,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof CatalogComponentWrapper>;

type Story = StoryObj<typeof CatalogComponentWrapper>;

//@ts-ignore
export const Primary: Story = () => {
  return (
    <DragContainerProvider>
      <CameraProvider>
        <ModalProvider>
          <CatalogComponentWrapper catalog={{ categories: [] }} />
        </ModalProvider>
      </CameraProvider>
    </DragContainerProvider>
  );
};
