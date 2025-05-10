import { createContext } from "react";
import { GameModule } from "@oh/utils";

export interface GamesContextType {
  loadGame: (gameId: string) => Promise<GameModule | null>;
  unloadGame: (gameId: string) => void;
  activeGames: Record<string, GameModule>;
}

export const GamesContext = createContext<GamesContextType>(undefined);
