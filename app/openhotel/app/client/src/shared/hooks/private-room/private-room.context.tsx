import React from "react";
import { RoomFurniture } from "shared/types";

export type PrivateRoomState = {
  addFurniture: (furniture: RoomFurniture) => void;
  updateFurniture: (furniture: RoomFurniture) => void;
  removeFurniture: (furniture: RoomFurniture | RoomFurniture[]) => void;
};

export const PrivateRoomContext =
  React.createContext<PrivateRoomState>(undefined);
