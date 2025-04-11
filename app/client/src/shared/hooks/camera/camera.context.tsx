import React from "react";
import { Point2d } from "shared/types";

export type CameraState = {
  isDragging: boolean;
  canDrag: boolean;
  position: Point2d;
  setDragging: (dragging: boolean) => void;
  setCanDrag: (canDrag: boolean) => void;
  setPosition: (position: Point2d) => void;
};

export const CameraContext = React.createContext<CameraState | undefined>(
  undefined,
);
