import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NavigatorComponent } from "./navigator.component";
import { ModalProvider } from "shared/hooks";
import { DragContainerProvider } from "@oh/pixi-components";

export default {
  title: "Modules/Modals/Navigator",
  component: NavigatorComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof NavigatorComponent>;

type Story = StoryObj<typeof NavigatorComponent>;

//@ts-ignore
export const Primary: Story = () => {
  return (
    <ModalProvider>
      <DragContainerProvider>
        <NavigatorComponent />
      </DragContainerProvider>
    </ModalProvider>
  );
};
