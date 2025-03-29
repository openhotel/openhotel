import React from "react";
import { FurnitureData } from "../../shared/types";

export type FurnitureState = {
  load: (...furnitureId: string[]) => Promise<void>;
  get: (furnitureId: string) => FurnitureData | null;
};

export const FurnitureContext = React.createContext<FurnitureState>(undefined);
