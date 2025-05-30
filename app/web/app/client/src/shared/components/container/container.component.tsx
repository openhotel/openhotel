import React from "react";
import { cn } from "shared/utils";

//@ts-ignore
import styles from "./container.module.scss";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const ContainerComponent: React.FC<Props> = ({
  children,
  className = "",
}) => <div className={cn(styles.container, className)}>{children}</div>;
