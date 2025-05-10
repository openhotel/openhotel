import React, { useEffect, useState } from "react";
import { ContainerComponent } from "@openhotel/pixi-components";
import { useGames } from "shared/hooks/games";

interface Props {
  gameId: string;
  onClose?: () => void;
}

export const GameContainer: React.FC<Props> = ({ gameId, onClose }) => {
  const { loadGame, unloadGame } = useGames();
  const [gameComponent, setGameComponent] = useState<React.JSX.Element | null>(
    null,
  );

  useEffect(() => {
    const initGame = async () => {
      const gameModule = await loadGame(gameId);
      console.log(gameModule);

      if (gameModule) {
        const gameElement = gameModule.start({
          data: {},
          onEnd: () => {
            console.debug(`${gameModule.name} finished`);
          },
        }) as React.JSX.Element;

        setGameComponent(gameElement);
      }
    };

    initGame();

    return () => {
      unloadGame(gameId);
    };
  }, [gameId, loadGame, unloadGame]);

  return <ContainerComponent>{gameComponent}</ContainerComponent>;
};
