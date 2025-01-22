import { DiscordIconComponent } from "./discord-icon.component";
import { BskyIconComponent } from "./bsky-icon.component";
import { GithubIconComponent } from "./github-icon.component";
import { HomeIconComponent } from "./home-icon.component";
import { HotelIconComponent } from "./hotel-icon.component";
import { CrossIconComponent } from "./cross-icon.component";
import { ChevronDownIconComponent } from "./chevron-down-icon.component";
import { ChevronUpIconComponent } from "./chevron-up-icon.component";
import { UploadIconComponent } from "./upload-icon.component";
import { AccountIconComponent } from "./account-icon.component";
import { AdminIconComponent } from "./admin-icon.component";
import { ConnectionsIconComponent } from "./connections-icon.component";

import { CCIconComponent, BYIconComponent, NCEUIconComponent } from "./cc";

export default {
  title: "Components/Icons",
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Discord = () => <DiscordIconComponent />;
export const Bsky = () => <BskyIconComponent />;
export const Github = () => <GithubIconComponent />;
export const Home = () => <HomeIconComponent />;
export const Hotel = () => <HotelIconComponent />;
export const Cross = () => <CrossIconComponent />;
export const ChevronDown = () => <ChevronDownIconComponent />;
export const ChevronUp = () => <ChevronUpIconComponent />;
export const Upload = () => <UploadIconComponent />;
export const Account = () => <AccountIconComponent />;
export const Admin = () => <AdminIconComponent />;
export const Connections = () => <ConnectionsIconComponent />;

export const CC = () => <CCIconComponent />;
export const BY = () => <BYIconComponent />;
export const NC_EU = () => <NCEUIconComponent />;
