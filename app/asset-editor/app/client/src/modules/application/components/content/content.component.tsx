import React from "react";
import styles from "./content.module.scss";

type Props = {
  children?: React.ReactNode;
};

export const ContentComponent: React.FC<Props> = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};
