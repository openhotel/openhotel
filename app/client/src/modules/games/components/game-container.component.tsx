import React, { useEffect, useState } from "react";
import { ContainerComponent } from "@openhotel/pixi-components";
import { useGames } from "shared/hooks/games";

interface Props {
  gameId: string;
}

export const GameContainer: React.FC<Props> = ({ gameId }) => {
  const { loadGame, unloadGame } = useGames();

  const [game, setGame] = useState<React.ReactNode | null>(null);

  useEffect(() => {
    const initGame = async () => {
      const gameModule = await loadGame(gameId);
      if (!gameModule) return;

      const gameNode = gameModule.start({
        data: {},
        onEnd: () => {
          console.debug(`> ${gameModule.name} finished`);
        },
      }) as React.ReactNode;

      setGame(gameNode);
    };

    initGame();

    return () => unloadGame(gameId);
  }, [gameId, loadGame, unloadGame, setGame]);

  return <ContainerComponent>{game}</ContainerComponent>;
};
