import { Meta, StoryObj } from "@storybook/react";
import { RoomsListComponentWrapper } from "./rooms-list.component";

export default {
  title: "Modules/Modals/Navigator/Category/Rooms/List",
  component: RoomsListComponentWrapper,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof RoomsListComponentWrapper>;

type Story = StoryObj<typeof RoomsListComponentWrapper>;

//@ts-ignore
export const Primary: Story = {
  args: {
    size: {
      width: 200,
      height: 200,
    },
    rooms: [
      {
        id: "1",
        title: "hello there",
        favorite: false,
        maxUsers: 10,
        users: 0,
      },
      {
        id: "2",
        title: "hello there",
        favorite: false,
        maxUsers: 10,
        users: 2,
      },
      {
        id: "3",
        title: "aha aha",
        favorite: true,
        maxUsers: 20,
        users: 15,
      },
      {
        id: "4",
        title: "aha aha",
        favorite: true,
        maxUsers: 20,
        users: 20,
      },
    ],
  },
};
