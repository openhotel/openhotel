import * as React from "react";

// @ts-ignore
import styles from "./footer.module.scss";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const FooterComponent: React.FC<Props> = ({ children }) => {
  return <footer className={styles.footer}>{children}</footer>;
};
