import React from "react";
import { IconComponent } from "./icon.component";
import type { IconProps } from "./icon.component";

export const DownloadIconComponent: React.FC<IconProps> = ({
  fill = "white",
  ...props
}) => (
  <IconComponent {...props}>
    <path
      d="M12.0281 16.5139L6.42086 10.9067L7.99088 9.28056L10.9066 12.1963V3.05653H13.1495V12.1963L16.0653 9.28056L17.6353 10.9067L12.0281 16.5139ZM5.29941 20.9997C4.68262 20.9997 4.15479 20.7803 3.71593 20.3414C3.27707 19.9025 3.05727 19.3743 3.05652 18.7568V15.3924H5.29941V18.7568H18.7568V15.3924H20.9997V18.7568C20.9997 19.3736 20.7802 19.9018 20.3414 20.3414C19.9025 20.781 19.3743 21.0004 18.7568 20.9997H5.29941Z"
      fill={fill}
    />
  </IconComponent>
);
