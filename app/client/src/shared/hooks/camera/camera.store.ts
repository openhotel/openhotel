import { create } from "zustand";

type CameraState = {
  isDragging: boolean;
  canDrag: boolean;
  setDragging: (dragging: boolean) => void;
  setCanDrag: (canDrag: boolean) => void;
};

export const useCameraStore = create<CameraState>((set) => ({
  isDragging: false,
  canDrag: true,
  setDragging: (isDragging) => set({ isDragging }),
  setCanDrag: (canDrag) => set({ canDrag }),
}));
