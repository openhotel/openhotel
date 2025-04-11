import React from "react";

export type CameraState = {
  isDragging: boolean;
  canDrag: boolean;
  setDragging: (dragging: boolean) => void;
  setCanDrag: (canDrag: boolean) => void;
};

export const CameraContext = React.createContext<CameraState | undefined>(
  undefined,
);
