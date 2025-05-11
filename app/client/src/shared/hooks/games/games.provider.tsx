import React, { useCallback, useState } from "react";
import { useApi } from "shared/hooks";
import { GameModule, GameManifest } from "@oh/utils";
import { GamesContext } from "./games.context";

export const GamesProvider = ({ children }) => {
  const { fetch } = useApi();

  // const [loadedModules, setLoadedModules] = useState<
  //   Record<string, GameModule>
  // >({});
  const [activeGames, setActiveGames] = useState<Record<string, GameModule>>(
    {},
  );

  const loadGame = useCallback(
    async (gameId: string): Promise<GameModule | null> => {
      // TODO: cause render loop
      // if (loadedModules[gameId]) {
      //   setActiveGames((prev) => ({
      //     ...prev,
      //     [gameId]: loadedModules[gameId],
      //   }));
      //   return loadedModules[gameId];
      // }

      try {
        const { manifest } = (await fetch(`/games/${gameId}`)) as {
          manifest: GameManifest;
        };
        if (!manifest) {
          console.warn(`Game manifest not found for ${gameId}`);
          return null;
        }

        const { game } = (await import(
          /* @vite-ignore */ manifest.clientUrl
        )) as { game: GameModule };

        console.log(game);

        // TODO: cause render loop
        // setLoadedModules((prev) => ({ ...prev, [gameId]: game }));
        // setActiveGames((prev) => ({ ...prev, [gameId]: game }));

        return game;
      } catch (error) {
        console.error(`Error loading game ${gameId}:`, error);
        return null;
      }
    },
    [fetch],
  );

  const unloadGame = useCallback(
    (gameId: string) => {
      if (activeGames[gameId] && activeGames[gameId].destroy) {
        activeGames[gameId].destroy();
      }

      setActiveGames((prev) => {
        const newGames = { ...prev };
        delete newGames[gameId];
        return newGames;
      });
    },
    [activeGames, setActiveGames],
  );

  return (
    <GamesContext.Provider value={{ loadGame, unloadGame, activeGames }}>
      {children}
    </GamesContext.Provider>
  );
};
