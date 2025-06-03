import React from "react";

export type GameState = {
  startGame: () => void;
};

export const GameContext = React.createContext<GameState>(undefined);
