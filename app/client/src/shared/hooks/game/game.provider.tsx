import React, { ReactNode, useCallback, useEffect, useRef } from "react";
import { GameContext } from "./game.context";
import { useEvents, useWindow, Event } from "@openhotel/pixi-components";
import { Size2d } from "shared/types";
import { useAccount, useApi, useConfig, useProxy } from "shared/hooks";
import { Event as ProxyEvent } from "shared/enums";

type GameProps = {
  children: ReactNode;
};

export const GameProvider: React.FunctionComponent<GameProps> = ({
  children,
}) => {
  const { fetch } = useApi();
  const { on: onProxy } = useProxy();
  const { getAccount } = useAccount();
  const { isDevelopment } = useConfig();
  const { on } = useEvents();
  const { getSize, getScale } = useWindow();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const $onResize = useCallback(
    (size: Size2d) => {
      const scale = getScale();
      iframeRef.current.width = `${size.width * scale}px`;
      iframeRef.current.height = `${size.height * scale}px`;
    },
    [getScale],
  );

  const startGame = useCallback(() => {}, [fetch]);

  useEffect(() => {
    const removeOnResize = on(Event.RESIZE, $onResize);

    const removeOnLoadGame = onProxy(
      ProxyEvent.LOAD_GAME,
      ({ gameId, token }) => {
        // return;
        iframeRef.current = document.createElement("iframe");
        iframeRef.current.setAttribute(
          "src",
          (isDevelopment() ? "/proxy/" : "/") +
            `game/${gameId}/?token=${token}&accountId=${getAccount().accountId}`,
        );
        iframeRef.current.style.position = "absolute";
        iframeRef.current.style.left = "0";
        iframeRef.current.style.top = "0";
        iframeRef.current.style.border = "0";
        // iframeRef.current.style.opacity = ".5";
        document.body.appendChild(iframeRef.current);

        $onResize(getSize());
      },
    );
    const removeOnRemoveGame = onProxy(ProxyEvent.REMOVE_GAME, () => {
      if (!iframeRef.current) return;

      document.body.removeChild(iframeRef.current);
      delete iframeRef.current;
    });

    return () => {
      removeOnResize();
      removeOnLoadGame();
      removeOnRemoveGame();
    };
  }, [on, onProxy, getAccount, $onResize, getSize, isDevelopment]);

  return (
    <GameContext.Provider
      value={{
        startGame,
      }}
      children={children}
    />
  );
};
