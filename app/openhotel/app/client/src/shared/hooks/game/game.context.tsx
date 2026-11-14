import React from "react";
import { Size2d } from "shared/types";

export type GameProps = {
  screen: "windowed" | "fullscreen";
  windowSize: Size2d;
};

export type GameState = {};

export const GameContext = React.createContext<GameState>(undefined);
