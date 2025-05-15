import React, { useCallback } from "react";
import { gamesLoaders, useApi } from "shared/hooks";
import { GameModule } from "@oh/utils";
import { GamesContext } from "./games.context";

export const GamesProvider = ({ children }) => {
  const { fetch } = useApi();

  const loadGame = useCallback(
    async (gameId: string): Promise<GameModule | null> => {
      try {
        // const { manifest } = (await fetch(`/games/${gameId}`)) as {
        //   manifest: GameManifest;
        // };
        // if (!manifest) {
        //   console.warn(`Game manifest not found for ${gameId}`);
        //   return null;
        // }

        const loader = gamesLoaders[gameId];
        const { game } = await loader();

        return game;
      } catch (error) {
        console.error(`Error loading game ${gameId}:`, error);
        return null;
      }
    },
    [fetch],
  );

  const unloadGame = useCallback((gameId: string) => {
    console.log(`unload ${gameId}`);
  }, []);

  return (
    <GamesContext.Provider value={{ loadGame, unloadGame }}>
      {children}
    </GamesContext.Provider>
  );
};
