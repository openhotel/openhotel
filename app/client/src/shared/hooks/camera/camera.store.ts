import { create } from "zustand";
import { Point2d } from "shared/types";

type CameraState = {
  isDragging: boolean;
  canDrag: boolean;
  position: Point2d;
  setDragging: (dragging: boolean) => void;
  setCanDrag: (canDrag: boolean) => void;
  setPosition: (position: Point2d) => void;
};

export const useCameraStore = create<CameraState>((set) => ({
  isDragging: false,
  canDrag: true,
  position: { x: 0, y: 0 },
  setDragging: (isDragging) => set({ isDragging }),
  setCanDrag: (canDrag) => set({ canDrag }),
  setPosition: (position) => set({ position }),
}));
