import { create } from "zustand";
import { Point } from "@shared/types/point.types.ts";

type CameraState = {
  $isDragging: boolean;
  $canDrag: boolean;
  $position: Point;

  isDragging: () => boolean;
  setDragging: (dragging: boolean) => void;

  canDrag: () => boolean;
  setCanDrag: (canDrag: boolean) => void;

  getPosition: () => Point;
  setPosition: (position: Point) => void;
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
