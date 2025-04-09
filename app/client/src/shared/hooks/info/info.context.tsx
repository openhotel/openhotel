import React from "react";

export type InfoState = {
  setExtra: (text: (string | null)[]) => void;
  clearExtra: () => void;
};

export const InfoContext = React.createContext<InfoState>(undefined);
