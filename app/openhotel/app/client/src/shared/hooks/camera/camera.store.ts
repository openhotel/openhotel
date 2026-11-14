import { create } from "zustand";
import { Point2d } from "shared/types";

type CameraState = {
  $isDragging: boolean;
  $canDrag: boolean;
  $position: Point2d;

  isDragging: () => boolean;
  setDragging: (dragging: boolean) => void;

  canDrag: () => boolean;
  setCanDrag: (canDrag: boolean) => void;

  getPosition: () => Point2d;
  setPosition: (position: Point2d) => void;
};

export const useCameraStore = create<CameraState>((set, get) => ({
  $isDragging: false,
  $canDrag: true,
  $position: { x: 0, y: 0 },

  isDragging: () => get().$isDragging,
  setDragging: ($isDragging) => set({ $isDragging }),

  canDrag: () => get().$canDrag,
  setCanDrag: ($canDrag) => set({ $canDrag }),

  getPosition: () => get().$position,
  setPosition: ($position) => set({ $position }),
}));
