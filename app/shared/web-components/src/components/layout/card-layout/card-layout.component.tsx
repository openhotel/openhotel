import * as React from "react";

// @ts-ignore
import styles from "./card-layout.module.scss";
import { BackgroundComponent, CardComponent } from "../../../components";
// import { cn } from "src/utils";

type Props = {} & React.HTMLProps<HTMLDivElement>;

export const CardLayoutComponent: React.FC<Props> = ({ children }) => {
  return (
    <BackgroundComponent>
      <div className={styles.wrapper}>
        <CardComponent className={styles.card}>
          <main className={styles.main}>
            <div className={styles.content}>{children}</div>
            <div className={styles.actions}>aha</div>
          </main>
        </CardComponent>
      </div>
    </BackgroundComponent>
  );
};
