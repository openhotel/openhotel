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
import { DatabaseIconComponent } from "./database-icon.component";
import { VerifiedIconComponent } from "./verified-icon.component";
import { OfficialIconComponent } from "./official-icon.component";
import { DownloadIconComponent } from "./download-icon.component";

import { CCIconComponent, BYIconComponent, NCEUIconComponent } from "./cc";
import {
  NoSignalIconComponent,
  LowSignalIconComponent,
  MediumSignalIconComponent,
  HighSignalIconComponent,
  FullSignalIconComponent,
} from "./signal";
import { NetworkIconComponent } from "./network-icon.component";
import { ForbiddenIconComponent } from "./forbidden-icon.component";
import { AnalyticsIconComponent } from "./analytics-icon.component";

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
export const Database = () => <DatabaseIconComponent />;
export const Verified = () => <VerifiedIconComponent />;
export const Official = () => <OfficialIconComponent />;
export const Network = () => <NetworkIconComponent />;
export const Download = () => <DownloadIconComponent />;
export const Forbidden = () => <ForbiddenIconComponent />;
export const Analytics = () => <AnalyticsIconComponent />;

export const CC = () => <CCIconComponent />;
export const BY = () => <BYIconComponent />;
export const NC_EU = () => <NCEUIconComponent />;

export const NoSignal = () => <NoSignalIconComponent />;
export const LowSignal = () => <LowSignalIconComponent />;
export const MediumSignal = () => <MediumSignalIconComponent />;
export const HighSignal = () => <HighSignalIconComponent />;
export const FullSignal = () => <FullSignalIconComponent />;
