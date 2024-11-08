import * as React from "react";

// @ts-ignore
import styles from "./header.module.scss";

type Props = {
  children?: React.ReactNode;
};

export const HeaderComponent: React.FC<Props> = ({ children }) => {
  return <header className={styles.header}>{children}</header>;
};
