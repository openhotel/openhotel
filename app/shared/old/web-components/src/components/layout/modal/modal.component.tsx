import type React from "react";
//@ts-ignore
import styles from "./modal.module.scss";
import { cn } from "../../../utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const ModalComponent: React.FC<Props> = ({
  children,
  className,
  style,
}) => {
  return (
    <div className={cn(styles.modal, className)} style={style}>
      {children}
    </div>
  );
};
