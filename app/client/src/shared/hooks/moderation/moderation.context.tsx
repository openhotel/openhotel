import React from "react";

export type ModerationState = {
  openConsoleNow?: number;
  closeConsoleNow?: number;
  clearConsoleNow?: number;

  openConsole: () => void;
  closeConsole: () => void;
  clearConsole: () => void;
};

export const ModerationContext =
  React.createContext<ModerationState>(undefined);
