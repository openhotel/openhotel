import { useContext } from "react";
import { CameraContext } from "shared/hooks/camera/camera.context";

export const useCamera = () => useContext(CameraContext);
