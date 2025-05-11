import React, { Suspense, useEffect, useState } from "react";
import {
  ContainerComponent,
  GraphicsComponent,
  GraphicType,
} from "@openhotel/pixi-components";
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
    let isMounted = true;

    const initGame = async () => {
      const gameModule = await loadGame(gameId);
      if (!gameModule) return;

      requestAnimationFrame(() => {
        if (isMounted) {
          const gameElement = gameModule.start({
            data: {},
            onEnd: () => {
              console.debug(`${gameModule.name} finished`);
            },
          }) as React.JSX.Element;

          setGameComponent(gameElement);
        }
      });
    };

    initGame();

    return () => {
      isMounted = false;
      unloadGame(gameId);
    };
  }, [gameId, loadGame, unloadGame]);

  return (
    <ContainerComponent>
      <Suspense
        fallback={
          <GraphicsComponent
            type={GraphicType.CIRCLE}
            radius={5}
            tint={0x00ff00}
          />
        }
      >
        {gameComponent}
      </Suspense>
    </ContainerComponent>
  );
};
