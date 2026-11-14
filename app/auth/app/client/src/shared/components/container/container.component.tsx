import React from "react";
import styles from "./container.module.scss";
import { cn } from "shared/utils";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export const ContainerComponent: React.FC<Props> = ({
  children,
  className = "",
}) => <div className={cn(styles.container, className)}>{children}</div>;
