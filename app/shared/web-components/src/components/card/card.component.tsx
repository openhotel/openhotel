import * as React from "react";
import { cn } from "../../utils";

//@ts-ignore
import styles from "./card.module.scss";

type Props = {
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

export const CardComponent: React.FC<Props> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn(styles.card, className)} {...props}>
      {children}
    </div>
  );
};
