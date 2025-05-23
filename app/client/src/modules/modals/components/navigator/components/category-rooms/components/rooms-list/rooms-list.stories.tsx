import { Meta, StoryObj } from "@storybook/react";
import { RoomsListComponent } from "./rooms-list.component";
import { ulid } from "ulidx";

export default {
  title: "Modules/Modals/Navigator/Category/Rooms/List",
  component: RoomsListComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof RoomsListComponent>;

type Story = StoryObj<typeof RoomsListComponent>;

//@ts-ignore
export const List: Story = {
  args: {
    size: {
      width: 200,
      height: 200,
    },
    rooms: [
      {
        id: ulid(),
        title: "Room 1",
        description: "Room 1 description",
        ownerUsername: "storybook",
        users: 0,
        maxUsers: 10,
        favorite: true,
        layoutIndex: 0,
      },
      {
        id: ulid(),
        title: "Room 2",
        description: "Room 2 description",
        ownerUsername: "storybook",
        users: 2,
        maxUsers: 10,
        favorite: true,
        layoutIndex: 0,
      },
    ],
  },
};
