import * as React from "react";

// @ts-ignore
import styles from "./navigator.module.scss";
// @ts-ignore
import image from "../../../../../assets/logo.png";
import { useLayout } from "../../../../hooks";
import { cn } from "../../../../utils";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const NavigatorComponent: React.FC<Props> = ({ children }) => {
  const { openNavigator } = useLayout();
  return (
    <nav
      className={cn(styles.navigator, {
        [styles.open]: openNavigator,
      })}
    >
      <div className={styles.logo}>
        <img alt="logo" src={image} />
      </div>
      <div className={styles.items}>
        <div className={styles.content}>{children}</div>
      </div>
    </nav>
  );
};
