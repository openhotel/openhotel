import * as React from "react";

// @ts-ignore
import styles from "./nav-item.module.scss";
import { cn } from "../../../../utils";
import type { BoxProps } from "../../../../components";
import { ButtonComponent } from "../../../../components";

type Props = {
  className?: string;
  selected?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
} & Partial<BoxProps>;

export const NavItemComponent: React.FC<Props> = ({
  className,
  selected,
  icon,
  children,
  ...props
}) => {
  return (
    <ButtonComponent
      {...props}
      color={selected ? "blue" : "dark"}
      className={cn(className, styles.navItem, [styles.selected, selected])}
    >
      {icon}
      <span className={styles.text}>{children}</span>
    </ButtonComponent>
  );
};
