import * as React from "react";

// @ts-ignore
import styles from "./card-layout.module.scss";
import {
  BackgroundComponent,
  BoxProps,
  CardComponent,
} from "../../../components";
import { cn } from "../../../utils";

type Props = {
  label?: React.ReactNode;
  actions?: React.ReactNode;
  centered?: boolean;
  className?: string;
} & Partial<BoxProps> &
  React.HTMLProps<HTMLDivElement>;

export const CardLayoutComponent: React.FC<Props> = ({
  label,
  children,
  actions,
  centered,
  className,
  ...props
}) => {
  return (
    <BackgroundComponent>
      <CardComponent
        {...props}
        className={cn(
          styles.card,
          [styles.centered, centered ?? true],
          className,
        )}
        topSection={label}
        bottomSection={actions}
        children={children}
      />
    </BackgroundComponent>
  );
};
