import * as React from "react";

// @ts-ignore
import styles from "./social.module.scss";
import {
  BskyIconComponent,
  DiscordIconComponent,
  GithubIconComponent,
} from "../index";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const SocialComponent: React.FC<Props> = () => (
  <div className={styles.social}>
    <a href="https://bsky.app/profile/openhotel.club" target="_blank">
      <BskyIconComponent />
    </a>
    <a href="https://discord.gg/qBZfPdNWUj" target="_blank">
      <DiscordIconComponent />
    </a>
    <a href="https://github.com/openhotel" target="_blank">
      <GithubIconComponent />
    </a>
  </div>
);
