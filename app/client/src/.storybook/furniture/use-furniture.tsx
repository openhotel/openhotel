import { useContext } from "react";
import { FurnitureContext, FurnitureState } from "./furniture.context";

export const useSBFurniture = (): FurnitureState =>
  useContext(FurnitureContext);
