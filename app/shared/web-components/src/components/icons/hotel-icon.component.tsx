import React from "react";
import { IconComponent, IconProps } from "./icon.component";

export const HotelIconComponent: React.FC<IconProps> = ({
  fill = "white",
  ...props
}) => (
  <IconComponent {...props}>
    <path
      d="M18,0H6c-1.654,0-3,1.346-3,3V24H11v-6h2v6h8V3c0-1.654-1.346-3-3-3Zm1,22h-4v-4h2v-2H7v2h2v4H5V3c0-.551,.449-1,1-1h12c.551,0,1,.449,1,1V22ZM7,12h2v2h-2v-2Zm8,0h2v2h-2v-2ZM7,4h2v2h-2v-2Zm8,0h2v2h-2v-2ZM7,8h2v2h-2v-2Zm8,0h2v2h-2v-2Zm-4,4h2v2h-2v-2Zm0-8h2v2h-2v-2Zm0,4h2v2h-2v-2Z"
      fill={fill}
    />
  </IconComponent>
);
