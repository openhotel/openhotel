import { useContext } from "react";
import { GameContext, GameState } from "./game.context";

export const useGame = (): GameState => useContext(GameContext);
