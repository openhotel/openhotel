import React from "react";
import styles from "./header.module.scss";
import { ContainerComponent } from "shared/components";

export const HeaderComponent = () => {
  return (
    <header className={styles.header}>
      <ContainerComponent>header</ContainerComponent>
    </header>
  );
};
