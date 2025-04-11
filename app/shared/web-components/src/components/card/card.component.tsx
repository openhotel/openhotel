import * as React from "react";
import { cn } from "../../utils";

//@ts-ignore
import styles from "./card.module.scss";
import { BoxComponent } from "../../components";
import type { BoxProps } from "../../components";

type Props = {
  className?: string;
  children: React.ReactNode;
  topSection?: React.ReactNode;
  bottomSection?: React.ReactNode;
} & Partial<BoxProps>;

export const CardComponent: React.FC<Props> = ({
  children,
  className,
  topSection,
  bottomSection,
  ...props
}) => {
  return (
    <BoxComponent className={cn(styles.card, className)} {...props}>
      {topSection ? (
        <div key="topSection" className={styles.topSection}>
          {topSection}
        </div>
      ) : null}

      <main key="content" className={styles.content}>
        {children}
      </main>

      {bottomSection ? (
        <div key="bottomSection" className={styles.bottomSection}>
          {bottomSection}
        </div>
      ) : null}
    </BoxComponent>
  );
};
