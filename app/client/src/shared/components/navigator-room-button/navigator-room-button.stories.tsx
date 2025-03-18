import { Meta, StoryObj } from "@storybook/react";
import { NavigatorRoomButtonComponent } from "./navigator-room-button.component";
import { fn } from "@storybook/test";

export default {
  title: "Shared/Navigator/Button",
  component: NavigatorRoomButtonComponent,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "light" },
  },
} as Meta<typeof NavigatorRoomButtonComponent>;

type Story = StoryObj<typeof NavigatorRoomButtonComponent>;

//@ts-ignore
export const Empty: Story = {
  args: {
    favorite: false,
    title: "Zana o kick - premio alpha RARE!!",
    users: 0,
    maxUsers: 20,
    size: {
      width: 187,
      height: 16,
    },
    onClickGo: fn(),
    onClickFavorite: fn(),
  },
};

//@ts-ignore
export const Some: Story = {
  args: {
    favorite: true,
    title: "Market-o-Mat",
    users: 4,
    maxUsers: 20,
    size: {
      width: 187,
      height: 16,
    },
    onClickGo: fn(),
    onClickFavorite: fn(),
  },
};

//@ts-ignore
export const SemiFull: Story = {
  args: {
    favorite: false,
    title: "Beach and fun! <3",
    users: 17,
    maxUsers: 20,
    size: {
      width: 250,
      height: 16,
    },
    onClickGo: fn(),
    onClickFavorite: fn(),
  },
};

//@ts-ignore
export const Full: Story = {
  args: {
    favorite: false,
    title: "Free furnis...",
    users: 258,
    maxUsers: 256,
    size: {
      width: 250,
      height: 16,
    },
    onClickGo: fn(),
    onClickFavorite: fn(),
  },
};
