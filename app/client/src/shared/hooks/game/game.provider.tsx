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
  useModal,
  useProxy,
} from "shared/hooks";
import { Event as ProxyEvent, Modal } from "shared/enums";
import { WindowedGameComponent } from "modules/modals";

type GameProps = {
  children: ReactNode;
};

const WINDOW_MARGIN = {
  lateral: 16,
  vertical: 21,
};

export const GameProvider: React.FunctionComponent<GameProps> = ({
  children,
}) => {
  const {
    set: setGame,
    clear: clearGame,
    getProps: getGameProps,
    props,
    name,
  } = useGameStore();

  const { on: onProxy, emit } = useProxy();
  const { getAccount } = useAccount();
  const { isDevelopment } = useConfig();
  const { on } = useEvents();
  const { getSize, getScale } = useWindow();
  const { setCanDrag } = useCamera();
  const { openModal, closeModal } = useModal();

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
        iframeRef.current.style.top = `${(size.height / 2 - $size.height / 2 + 6) * scale}px`;
      }
    },
    [getScale, getGameProps, setWindowSize],
  );

  useEffect(() => {
    const removeOnResize = on(Event.RESIZE, $onResize);

    const removeOnLoadGame = onProxy(
      ProxyEvent.LOAD_GAME,
      ({ gameId, name, token, properties }) => {
        setGame(gameId, name, token, properties);
        openModal(Modal.GAME);

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

      closeModal(Modal.GAME);
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
    openModal,
    closeModal,
  ]);

  const closeGame = useCallback(() => {
    emit(ProxyEvent.CLOSE_GAME, {});
  }, [emit]);

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
                <WindowedGameComponent
                  gameName={name}
                  size={{
                    width: props.windowSize.width + WINDOW_MARGIN.lateral * 2,
                    height:
                      props.windowSize.height + WINDOW_MARGIN.vertical * 2,
                  }}
                  onCloseModal={closeGame}
                />
              </FlexContainerComponent>
            </>
          ) : null}
        </>
      }
    />
  );
};
