import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { NavigatorComponentWrapper } from "./navigator.component";
import { CameraProvider, ModalProvider } from "shared/hooks";
import { DragContainerProvider } from "@openhotel/pixi-components";
import { fn } from "@storybook/test";
import { ModalNavigatorTab } from "shared/enums";
import { CategoryRoomsComponentWrapper } from ".";

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
            navigatorTabMap={
              {
                [ModalNavigatorTab.ROOMS]: () => (
                  <CategoryRoomsComponentWrapper
                    rooms={[]}
                    size={{ width: 10, height: 10 }}
                    onClickFavorite={fn()}
                    onClickGo={fn()}
                  />
                ),
              } as any
            }
          />
        </DragContainerProvider>
      </ModalProvider>
    </CameraProvider>
  );
};
