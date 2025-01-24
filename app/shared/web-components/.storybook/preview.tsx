import "../styles.scss";
import "./style.css";
import { BackgroundComponent } from "../src/components";
import { useEffect, useState } from "react";
import { addons } from "@storybook/preview-api";
import { DARK_MODE_EVENT_NAME } from "storybook-dark-mode";

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "fullscreen",
  },
};

const channel = addons.getChannel();

const ThemeSwitcherComponent: React.FC = ({ children }) => {
  const handleColorScheme = (value: boolean) => {
    if (!value) {
      document.documentElement.classList.add("light-theme");
      document.documentElement.classList.remove("dark-theme");
    } else {
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.remove("light-theme");
    }
  };

  useEffect(() => {
    channel.on(DARK_MODE_EVENT_NAME, handleColorScheme);
    return () => channel.off(DARK_MODE_EVENT_NAME, handleColorScheme);
  }, [channel]);

  return children;
};

export default preview;

export const decorators = [
  (renderStory) => (
    <BackgroundComponent className="storybook-background">
      {renderStory()}
    </BackgroundComponent>
  ),
  (renderStory) => (
    <ThemeSwitcherComponent>{renderStory()}</ThemeSwitcherComponent>
  ),
];
