import React from "react";
import { useSideContent } from "shared/hooks";
//@ts-ignore
import styles from "./content.module.scss";

type Props = {
  children?: React.ReactNode;
};

export const ContentComponent: React.FC<Props> = ({ children }) => {
  const { component } = useSideContent();

  return (
    <div className={styles.wrapper}>
      <div className={styles.contentWrapper}>
        <div className={styles.content}>{children}</div>
      </div>
      {component ? (
        <div className={styles.componentWrapper}>
          <div className={styles.component}>{component}</div>
        </div>
      ) : null}
    </div>
  );
};
