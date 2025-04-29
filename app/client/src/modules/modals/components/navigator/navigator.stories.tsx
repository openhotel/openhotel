import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NavigatorComponentWrapper } from "./navigator.component";
import { CameraProvider, ModalProvider } from "shared/hooks";
import { DragContainerProvider } from "@openhotel/pixi-components";
import { fn } from "@storybook/test";

export default {
  title: "Modules/Modals/Navigator",
  component: NavigatorComponentWrapper,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof NavigatorComponentWrapper>;

type Story = StoryObj<typeof NavigatorComponentWrapper>;

//@ts-ignore
export const Primary: Story = () => {
  return (
    <CameraProvider>
      <ModalProvider>
        <DragContainerProvider>
          <NavigatorComponentWrapper
            onPointerDown={fn()}
            navigatorTabMap={{} as any}
          />
        </DragContainerProvider>
      </ModalProvider>
    </CameraProvider>
  );
};
