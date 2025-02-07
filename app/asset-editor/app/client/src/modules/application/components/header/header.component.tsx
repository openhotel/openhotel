import React from "react";
import styles from "./header.module.scss";
import { LinkComponent } from "shared/components";

export const HeaderComponent = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <LinkComponent to="/">Open Hotel Asset Editor</LinkComponent>
      </div>
    </header>
  );
};
