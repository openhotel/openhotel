import React, { useCallback, useEffect, useState } from "react";
import { ContainerComponent } from "@openhotel/pixi-components";
import { useProxy, useGames } from "shared/hooks";
import { Event as ProxyEvent } from "shared/enums";

interface Props {
  gameId: string;
}

type onEmitType = <Data extends unknown>(event: string, data?: Data) => void;

export const GameContainer: React.FC<Props> = ({ gameId }) => {
  const { loadGame, unloadGame } = useGames();
  const { emit } = useProxy();

  const [game, setGame] = useState<React.ReactNode | null>(null);

  const emitEvent = useCallback<onEmitType>(
    (event, data) => {
      emit(ProxyEvent.GAME_EVENT, { gameId, event, data });
    },
    [emit, gameId],
  );

  useEffect(() => {
    const initGame = async () => {
      const gameModule = await loadGame(gameId);
      if (!gameModule) return;

      const gameNode = gameModule.start({
        data: {},
        onEnd: () => {
          console.debug(`> ${gameModule.name} finished`);
        },
        events: {
          emit: emitEvent, // TODO:!
        },
      }) as React.ReactNode;

      setGame(gameNode);
    };

    initGame();

    return () => {
      unloadGame(gameId);
    };
  }, [gameId, loadGame, unloadGame, setGame, emitEvent]);
  return <ContainerComponent>{game}</ContainerComponent>;
};
