import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { GameContext } from "./game.context";
import {
  Event,
  EventMode,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  useEvents,
  useWindow,
} from "@openhotel/pixi-components";
import { Size2d } from "shared/types";
import {
  useAccount,
  useCamera,
  useConfig,
  useGameStore,
  useProxy,
} from "shared/hooks";
import { Event as ProxyEvent } from "shared/enums";
import { WindowedGameComponent } from "modules/modals";

type GameProps = {
  children: ReactNode;
};

export const GameProvider: React.FunctionComponent<GameProps> = ({
  children,
}) => {
  const {
    set: setGame,
    clear: clearGame,
    getProps: getGameProps,
    props,
  } = useGameStore();

  const { on: onProxy } = useProxy();
  const { getAccount } = useAccount();
  const { isDevelopment } = useConfig();
  const { on } = useEvents();
  const { getSize, getScale } = useWindow();
  const { setCanDrag } = useCamera();

  const [windowSize, setWindowSize] = useState<Size2d>(getSize());

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const $onResize = useCallback(
    (size: Size2d) => {
      setWindowSize(size);
      if (!iframeRef.current) return;
      const scale = getScale();

      const gameProps = getGameProps();
      const isFullscreen = gameProps.screen === "fullscreen";

      const $size = isFullscreen ? size : gameProps.windowSize;
      iframeRef.current.width = `${$size.width * scale}px`;
      iframeRef.current.height = `${$size.height * scale}px`;

      if (gameProps.screen === "windowed") {
        iframeRef.current.style.left = `${(size.width / 2 - $size.width / 2) * scale}px`;
        iframeRef.current.style.top = `${(size.height / 2 - $size.height / 2) * scale}px`;
      }
    },
    [getScale, getGameProps, setWindowSize],
  );

  useEffect(() => {
    const removeOnResize = on(Event.RESIZE, $onResize);

    const removeOnLoadGame = onProxy(
      ProxyEvent.LOAD_GAME,
      ({ gameId, token, properties }) => {
        setGame(gameId, token, properties);

        setCanDrag(false);

        iframeRef.current = document.createElement("iframe");
        iframeRef.current.setAttribute(
          "src",
          (isDevelopment() ? "/proxy/" : "/") +
            `game/${gameId}/?gameId=${gameId}&token=${token}&accountId=${getAccount().accountId}`,
        );
        iframeRef.current.style.position = "absolute";
        iframeRef.current.style.left = "0";
        iframeRef.current.style.top = "0";
        iframeRef.current.style.border = "0";
        // iframeRef.current.style.backgroundColor = "#000";
        // iframeRef.current.style.opacity = ".5";
        document.body.appendChild(iframeRef.current);

        $onResize(getSize());
      },
    );
    const removeOnRemoveGame = onProxy(ProxyEvent.REMOVE_GAME, () => {
      clearGame();
      setCanDrag(true);

      if (!iframeRef.current) return;

      document.body.removeChild(iframeRef.current);
      delete iframeRef.current;
    });

    return () => {
      removeOnResize();
      removeOnLoadGame();
      removeOnRemoveGame();
    };
  }, [
    setGame,
    clearGame,
    on,
    onProxy,
    getAccount,
    $onResize,
    getSize,
    isDevelopment,
    setCanDrag,
  ]);

  return (
    <GameContext.Provider
      value={{}}
      children={
        <>
          {children}
          {props ? (
            <GraphicsComponent
              type={GraphicType.RECTANGLE}
              width={windowSize.width}
              height={windowSize.height}
              alpha={props?.screen === "windowed" ? 0.5 : 1}
              tint={0}
              eventMode={EventMode.STATIC}
            />
          ) : null}
          {props?.screen === "windowed" ? (
            <>
              <FlexContainerComponent
                align={FLEX_ALIGN.CENTER}
                justify={FLEX_JUSTIFY.CENTER}
                zIndex={Number.MAX_SAFE_INTEGER}
              >
                <WindowedGameComponent size={props.windowSize} />
              </FlexContainerComponent>
            </>
          ) : null}
        </>
      }
    />
  );
};
