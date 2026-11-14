import React from "react";
import { IconComponent } from "./icon.component";
import type { IconProps } from "./icon.component";

export const UploadIconComponent: React.FC<IconProps> = ({
  fill = "white",
  ...props
}) => (
  <IconComponent {...props}>
    <path
      d="M10.8812 16.5026V7.33976L7.95809 10.2629L6.38411 8.63267L12.0055 3.01131L17.6268 8.63267L16.0529 10.2629L13.1297 7.33976V16.5026H10.8812ZM5.25984 20.9997C4.64149 20.9997 4.11233 20.7797 3.67236 20.3397C3.2324 19.8998 3.01204 19.3702 3.01129 18.7511V15.3783H5.25984V18.7511H18.7511V15.3783H20.9997V18.7511C20.9997 19.3695 20.7797 19.899 20.3397 20.3397C19.8997 20.7804 19.3702 21.0004 18.7511 20.9997H5.25984Z"
      fill={fill}
    />
  </IconComponent>
);
