import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NavigatorComponentWrapper } from "./navigator.component";
import { ModalProvider } from "shared/hooks";
import { DragContainerProvider } from "@oh/pixi-components";
import { fn } from "@storybook/test";
import { ModalNavigatorTab } from "shared/enums";
import { CategoryRoomsComponentWrapper } from "modules/modals/components/navigator/components";

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
    <ModalProvider>
      <DragContainerProvider>
        <NavigatorComponentWrapper
          onPointerDown={fn()}
          navigatorTabMap={{
            [ModalNavigatorTab.ROOMS]: () => (
              <CategoryRoomsComponentWrapper rooms={[]} />
            ),
          }}
        />
      </DragContainerProvider>
    </ModalProvider>
  );
};
