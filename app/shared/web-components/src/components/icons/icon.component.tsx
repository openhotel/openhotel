import type React from "react";
import { cn } from "../../utils";
//@ts-ignore
import styles from "./icon.module.scss";

export type IconProps = {
  className?: string;
  width?: number;
  height?: number;
  fill?: string;
  stroke?: string;
} & React.SVGProps<SVGSVGElement>;

export const IconComponent: React.FC<IconProps> = ({
  children,
  className = "",
  width = 24,
  height = 24,
  ...props
}) => (
  <svg
    {...props}
    className={cn(className, styles.icon)}
    width={width}
    height={height}
    viewBox={`0 0 24 24`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {children}
  </svg>
);
