import React from "react";
import { Point } from "@shared/types/point.types.ts";

export type CameraState = {
  position: Point;
  setPosition: (position: Point) => void;

  setDragging: (dragging: boolean) => void;
  isDragging: () => boolean;

  setCanDrag: (canDrag: boolean) => void;
  canDrag: () => boolean;
};

export const CameraContext = React.createContext<CameraState | undefined>(
  undefined,
);
