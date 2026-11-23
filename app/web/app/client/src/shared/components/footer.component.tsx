import React from "react";
import { Link } from "react-router";
import {
  GITHUB_URL,
  DISCORD_URL,
  BSKY_URL,
  OPENHOTEL_URL,
} from "shared/consts/socials.consts.ts";

export const FooterComponent: React.FC = () => {
  return (
    <div className="border bg-(--field) text-(--ink) flex flex-col items-center gap-1 justify-center py-3">
      <div className="flex flex-dots">
        <Link className="link" to={GITHUB_URL} target="_blank">
          GitHub
        </Link>
        <Link className="link" to={DISCORD_URL} target="_blank">
          Discord
        </Link>
        <Link className="link" to={BSKY_URL} target="_blank">
          Bluesky
        </Link>
      </div>
      <label>
        <Link className="link" to={OPENHOTEL_URL} target="_blank">
          OpenHotel
        </Link>{" "}
        is open source.
      </label>
      <label>
        Art and content licensed under{" "}
        <Link
          className="link"
          to="https://creativecommons.org/licenses/by-nc-sa/4.0/"
          target="_blank"
        >
          CC BY-NC-SA 4.0
        </Link>
        .
      </label>
    </div>
  );
};
