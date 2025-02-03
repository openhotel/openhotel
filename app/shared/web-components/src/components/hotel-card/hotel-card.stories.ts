import { fn } from "@storybook/test";
import { HotelCardComponent } from "./hotel-card.component";

export default {
  title: "Components/Hotel/Card",
  component: HotelCardComponent,
  parameters: {
    layout: "centered",
  },
  args: { onClick: fn() },
};

export const Primary = {
  args: {
    title: "openhotel.club",
    owner: "pagoru",
    description:
      "The official Open Hotel server. Join with friends, play, earn credits, build your rooms, trade furniture and enjoy this authentic hotel experience.",
    ms: 400,
    users: 13,
    maxUsers: 200,
    joinedUsers: 32,

    logo: "/assets/hotel/hotel-logo.webp",
    background: "/assets/hotel/hotel-background.webp",
  },
};

export const Secondary = {
  args: {
    title: "openhotel.club",
    owner: "pagoru",
    ms: 100,
    joinedUsers: 32,

    logo: "/assets/hotel/hotel-logo.webp",
    background: "/assets/hotel/hotel-background.webp",

    onClickWebsite: () => {},
  },
};

export const Verified = {
  args: {
    title: "openhotel.club",
    owner: "pagoru",
    verified: true,
    ms: 50,
    users: 13,
    maxUsers: 200,
    joinedUsers: 32,

    logo: "/assets/hotel/hotel-logo.webp",
    background: "/assets/hotel/hotel-background.webp",
  },
};

export const VerifiedAndOfficial = {
  args: {
    title: "openhotel.club",
    owner: "pagoru",
    verified: true,
    official: true,
    description:
      "The official Open Hotel server. Join with friends, play, earn credits, build your rooms, trade furniture and enjoy this authentic hotel experience.",
    ms: 150,
    users: 13,
    maxUsers: 200,
    joinedUsers: 32,

    logo: "/assets/hotel/hotel-logo.webp",
    background: "/assets/hotel/hotel-background.webp",

    onClickWebsite: () => {},
  },
};

export const NotReachable = {
  args: {
    title: "openhotel.club",
    owner: "pagoru",
    description:
      "The official Open Hotel server. Join with friends, play, earn credits, build your rooms, trade furniture and enjoy this authentic hotel experience.",

    joinedUsers: 32,

    logo: "/assets/hotel/hotel-logo.webp",
    background: "/assets/hotel/hotel-background.webp",
  },
};

export const BadPing = {
  args: {
    title: "openhotel.club",
    owner: "pagoru",
    description:
      "The official Open Hotel server. Join with friends, play, earn credits, build your rooms, trade furniture and enjoy this authentic hotel experience.",
    ms: 600,
    users: 13,
    maxUsers: 200,
    joinedUsers: 32,

    logo: "/assets/hotel/hotel-logo.webp",
    background: "/assets/hotel/hotel-background.webp",
  },
};
