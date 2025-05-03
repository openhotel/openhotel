import React from "react";
import { Point2d } from "shared/types";

export type CameraState = {
  getPosition: () => Point2d;
  setPosition: (position: Point2d) => void;

  setDragging: (dragging: boolean) => void;
  isDragging: () => boolean;

  setCanDrag: (canDrag: boolean) => void;
  canDrag: () => boolean;
};

export const CameraContext = React.createContext<CameraState | undefined>(
  undefined,
);
