import React from "react";
import { IconComponent, IconProps } from "./icon.component";

export const ChevronUpIconComponent: React.FC<IconProps> = ({
  fill = "white",
  ...props
}) => (
  <IconComponent {...props}>
    <path
      d="M12 17C11.6667 17 11.3525 16.87 11.1158 16.6342L2.09332 7.61083L2.68249 7.02167L11.705 16.0442C11.8625 16.2017 12.1367 16.2017 12.2942 16.0442L21.3167 7.02167L21.9058 7.61083L12.8833 16.6333C12.6475 16.8692 12.3333 16.9992 11.9992 16.9992L12 17Z"
      transform="rotate(180, 12, 12)"
      fill={fill}
    />
  </IconComponent>
);
