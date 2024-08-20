import React from "react";
import styles from "./footer.module.scss";
import { ContainerComponent } from "shared/components";

export const FooterComponent = () => {
  return (
    <footer className={styles.footer}>
      <ContainerComponent>footer</ContainerComponent>
    </footer>
  );
};
