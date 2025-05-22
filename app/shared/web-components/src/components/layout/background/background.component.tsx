import * as React from "react";

// @ts-ignore
import styles from "./background.module.scss";
import { cn } from "../../../utils";
// @ts-ignore
import darkBackground from "../../../../assets/backgrounds/dark-bg.webp";
// @ts-ignore
import lightBackground from "../../../../assets/backgrounds/light-bg.webp";
import { useTheme } from "../../../hooks";

type Props = {
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

export const BackgroundComponent: React.FC<Props> = ({
  className,
  children,
  ...props
}) => {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={cn(styles.background, className)}
      {...props}
      style={{
        background: `url(${isDarkMode ? darkBackground : lightBackground})`,
      }}
    >
      {children}
    </div>
  );
};
