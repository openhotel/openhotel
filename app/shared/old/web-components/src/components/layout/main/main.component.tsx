import * as React from "react";

// @ts-ignore
import styles from "./main.module.scss";
import { cn } from "../../../utils";

type Props = {
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

export const MainComponent: React.FC<Props> = ({ className, children }) => {
  return (
    <main className={cn(styles.main, className)}>
      <div className={styles.content}>{children}</div>
    </main>
  );
};
