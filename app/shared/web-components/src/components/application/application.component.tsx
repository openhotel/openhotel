import * as React from "react";

import * as styles from "./application.module.scss";

type Props = {
  children: React.ReactNode;
};

export const Application: React.FC<Props> = ({ children }) => {
  return <div className={styles.application}>{children}</div>;
};
