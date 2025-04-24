import React from "react";
import { Size } from "@openhotel/pixi-components";

export type SafeWindowState = {
  getSafeSize: () => Size;
  getSafeXPosition: () => number;
};

export const SafeWindowContext =
  React.createContext<SafeWindowState>(undefined);
