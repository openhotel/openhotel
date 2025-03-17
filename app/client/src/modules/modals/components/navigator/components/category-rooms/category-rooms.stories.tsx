import { Meta, StoryObj } from "@storybook/react";
import { CategoryRoomsComponent } from "./category-rooms.component";

export default {
  title: "Modules/Modals/Navigator/Category/Rooms",
  component: CategoryRoomsComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof CategoryRoomsComponent>;

type Story = StoryObj<typeof CategoryRoomsComponent>;

//@ts-ignore
export const Primary: Story = {
  args: {
    size: {
      width: 200,
      height: 200,
    },
  },
};
