import React from "react";
import { LinkComponent } from "shared/components";

//@ts-ignore
import styles from "./home.module.scss";

export const HomeComponent: React.FC = () => {
  return (
    <div className={styles.home}>
      <div className={styles.content}>
        <h4>Sprite Sheets:</h4>
        <div className={styles.content}>
          {/*<LinkComponent to="/sprite-sheet/create">*/}- (TODO) Create Sprite
          Sheet
          {/*</LinkComponent>*/}
        </div>
        <h4>Furniture:</h4>
        <div className={styles.content}>
          <LinkComponent to="/furniture/create">
            - Create furniture
          </LinkComponent>
        </div>
      </div>
      <h4>Human:</h4>
      <div className={styles.content}>
        <div className={styles.content}>
          <h5>Human:</h5>
          {/*<LinkComponent to="/human/create">*/}- (TODO) Create human
          {/*</LinkComponent>*/}
        </div>
      </div>
    </div>
  );
};
