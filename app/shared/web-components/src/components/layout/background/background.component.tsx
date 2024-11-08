import * as React from "react";

// @ts-ignore
import styles from "./background.module.scss";
import { cn } from "../../../utils";

type Props = {
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

export const BackgroundComponent: React.FC<Props> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div className={cn(styles.background, className)} {...props}>
      {children}
    </div>
  );
};
