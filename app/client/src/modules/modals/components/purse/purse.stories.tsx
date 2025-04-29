import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CameraProvider, ModalProvider } from "shared/hooks";
import { PurseComponentWrapper } from "./purse.component";
import { DragContainerProvider } from "@openhotel/pixi-components";

export default {
  title: "Modules/Modals/Purse",
  component: PurseComponentWrapper,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof PurseComponentWrapper>;

type Story = StoryObj<typeof PurseComponentWrapper>;

export const Primary: Story = () => {
  return (
    <DragContainerProvider>
      <CameraProvider>
        <ModalProvider>
          <PurseComponentWrapper
            credits={0}
            setDragPolygon={() => {}}
            onPointerDown={() => {}}
            transactions={[]}
          />
        </ModalProvider>
      </CameraProvider>
    </DragContainerProvider>
  );
};
