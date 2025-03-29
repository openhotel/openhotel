import { Meta, StoryObj } from "@storybook/react";
import { HotBarItemsComponent } from "./hot-bar-items.component";
import { FlexContainerComponent } from "@oh/pixi-components";
import React from "react";
import { ModalProvider } from "shared/hooks";

export default {
  title: "Shared/Hot Bar Items",
  component: HotBarItemsComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof HotBarItemsComponent>;

type Story = StoryObj<typeof HotBarItemsComponent>;

//@ts-ignore
export const Primary: Story = () => {
  return (
    <ModalProvider>
      <FlexContainerComponent>
        <HotBarItemsComponent />
      </FlexContainerComponent>
    </ModalProvider>
  );
};
