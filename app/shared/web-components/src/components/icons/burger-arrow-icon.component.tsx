import React from "react";
import { IconComponent } from "./icon.component";
import type { IconProps } from "./icon.component";

export const BurgerArrowIconComponent: React.FC<IconProps> = ({
  fill = "white",
  ...props
}) => (
  <IconComponent {...props}>
    <path
      d="M14.3491 3.45907C14.8495 3.07065 15.5725 3.11672 16.0191 3.58504C16.4953 4.08462 16.4765 4.87527 15.9771 5.35165L8.65187 12.335L15.9771 19.3194L16.065 19.4122C16.4771 19.8935 16.4657 20.6186 16.0191 21.087C15.5724 21.5552 14.8494 21.6005 14.3491 21.212L14.2515 21.129L5.97902 13.2403C5.73169 13.0045 5.59141 12.6778 5.59132 12.336C5.59132 11.9942 5.73162 11.6666 5.97902 11.4307L14.2515 3.54305L14.3491 3.45907Z"
      fill={fill}
    />
  </IconComponent>
);
