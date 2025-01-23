import { Socials } from "shared/enums";

type SocialData = {
  texture: string;
  url: string;
};

export const SOCIALS_LIST: Record<Socials, SocialData> = {
  [Socials.DISCORD]: {
    texture: "discord-white",
    url: "https://discord.com/invite/qBZfPdNWUj",
  },
  [Socials.GITHUB]: {
    texture: "github-white",
    url: "https://github.com/openhotel",
  },
  [Socials.BLUESKY]: {
    texture: "bluesky-white",
    url: "https://bsky.app/profile/openhotel.club",
  },
};
