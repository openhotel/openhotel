import React from "react";
import { IconComponent } from "./icon.component";
import type { IconProps } from "./icon.component";
//@ts-ignore
import styles from "./loading-icon.module.scss";
import { cn } from "../../utils";

export const LoadingIconComponent: React.FC<IconProps> = ({
  fill = "white",
  ...props
}) => (
  <IconComponent {...props} className={cn(styles.animateSpin, props.className)}>
    <circle
      className={styles.circle}
      cx="12"
      cy="12"
      r="10"
      stroke={fill}
      strokeWidth="4"
      fill="none"
    ></circle>
    <path
      className={styles.move}
      color={fill}
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </IconComponent>
);
