import * as React from "react";

// @ts-ignore
import styles from "./nav-item.module.scss";
import { cn } from "../../../../utils";

type Props = {
  className?: string;
  selected?: boolean;
  icon?: React.ReactNode;
} & React.HTMLProps<HTMLDivElement>;

export const NavItemComponent: React.FC<Props> = ({
  className,
  selected,
  icon,
  children,
  ...props
}) => {
  return (
    <div
      className={cn(styles.navItem, className, {
        [styles.selected]: Boolean(selected),
      })}
      {...props}
    >
      {icon}
      <span className={styles.text}>{children}</span>
    </div>
  );
};
