import React from "react";
import { IconComponent } from "./icon.component";
import type { IconProps } from "./icon.component";

export const ForbiddenIconComponent: React.FC<IconProps> = ({
  fill = "white",
  ...props
}) => (
  <IconComponent {...props}>
    <path
      d="M12.0008 2C6.48082 2 2.00082 6.48 2.00082 12C2.00082 17.52 6.48082 22 12.0008 22C17.5208 22 22.0008 17.52 22.0008 12C22.0008 6.48 17.5208 2 12.0008 2ZM4.00082 12C4.00082 7.58 7.58082 4 12.0008 4C13.8508 4 15.5508 4.63 16.9008 5.69L5.69082 16.9C4.59245 15.5032 3.99706 13.7769 4.00082 12ZM12.0008 20C10.1508 20 8.45082 19.37 7.10082 18.31L18.3108 7.1C19.4092 8.49679 20.0046 10.2231 20.0008 12C20.0008 16.42 16.4208 20 12.0008 20Z"
      fill={fill}
    />
  </IconComponent>
);
