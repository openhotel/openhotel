import { useContext } from "react";
import { GamesContext } from "./games.context";

export const useGames = () => {
  const context = useContext(GamesContext);
  if (!context) {
    throw new Error("useGames must be used within a GameProvider");
  }
  return context;
};
