import React from "react";
//@ts-ignore
import styles from "./modal-background.module.scss";

type Props = {
  children: React.ReactNode;
};

export const ModalBackgroundComponent: React.FC<Props> = ({ children }) => (
  <div className={styles.background}>{children}</div>
);
