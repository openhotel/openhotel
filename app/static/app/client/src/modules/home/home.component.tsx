import React from "react";
import { LinkComponent } from "shared/components";

//@ts-ignore
import styles from "./home.module.scss";

export const HomeComponent: React.FC = () => {
  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <h4>Files</h4>
      </div>
    </div>
  );
};
