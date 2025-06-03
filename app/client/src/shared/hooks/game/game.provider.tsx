import React, { ReactNode, useCallback, useRef } from "react";
import { GameContext } from "./game.context";
import { useEvents, useWindow, Event } from "@openhotel/pixi-components";
import { Size2d } from "shared/types";
import { useApi } from "shared/hooks";

type GameProps = {
  children: ReactNode;
};

export const GameProvider: React.FunctionComponent<GameProps> = ({
  children,
}) => {
  const { on } = useEvents();
  const { getPath } = useApi();
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

  console.log(getPath(""));
  const startGame = useCallback(() => {
    iframeRef.current = document.createElement("iframe");
    iframeRef.current.setAttribute("src", "/phantom");
    iframeRef.current.style.position = "absolute";
    iframeRef.current.style.left = "0";
    iframeRef.current.style.top = "0";
    iframeRef.current.style.border = "0";
    // iframeRef.current.style.opacity = ".5";
    document.body.appendChild(iframeRef.current);

    const removeOnResize = on(Event.RESIZE, $onResize);
    $onResize(getSize());

    setTimeout(() => {
      document.body.removeChild(iframeRef.current);
    }, 10_000);

    return () => {
      removeOnResize();
      document.body.removeChild(iframeRef.current);
    };
  }, [on, $onResize, getSize]);

  return (
    <GameContext.Provider
      value={{
        startGame,
      }}
      children={children}
    />
  );
};
