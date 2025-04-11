import React, { ReactNode, useCallback } from "react";
import { CameraContext } from "./camera.context";
import { useCameraStore } from "./camera.store";
import { Point2d } from "shared/types";

type CameraProviderProps = {
  children: ReactNode;
};

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const {
    isDragging,
    canDrag,
    position,
    setDragging: $setDragging,
    setCanDrag: $setCanDrag,
    setPosition: $setPosition,
  } = useCameraStore();

  const setDragging = useCallback(
    (dragging: boolean) => $setDragging(dragging),
    [$setDragging],
  );

  const setCanDrag = useCallback(
    (canDrag: boolean) => $setCanDrag(canDrag),
    [$setCanDrag],
  );

  const setPosition = useCallback(
    (position: Point2d) => $setPosition(position),
    [$setPosition],
  );

  return (
    <CameraContext.Provider
      value={{
        isDragging,
        canDrag,
        position,
        setDragging,
        setCanDrag,
        setPosition,
      }}
    >
      {children}
    </CameraContext.Provider>
  );
};
