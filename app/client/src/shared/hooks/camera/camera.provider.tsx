import React, { ReactNode, useCallback } from "react";
import { CameraContext } from "./camera.context";
import { useCameraStore } from "./camera.store";

type CameraProviderProps = {
  children: ReactNode;
};

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const {
    isDragging,
    canDrag,
    setDragging: $setDragging,
    setCanDrag: $setCanDrag,
  } = useCameraStore();

  const setDragging = useCallback(
    (dragging: boolean) => $setDragging(dragging),
    [$setDragging],
  );

  const setCanDrag = useCallback(
    (canDrag: boolean) => $setCanDrag(canDrag),
    [$setCanDrag],
  );

  return (
    <CameraContext.Provider
      value={{
        isDragging,
        canDrag,
        setDragging,
        setCanDrag,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};
