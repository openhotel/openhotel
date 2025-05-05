import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ContainerComponent,
  Event as OhEvent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  KeyboardEventExtended,
  NineSliceSpriteComponent,
  SpriteTextInputComponent,
  useApplication,
  useCursor,
  useEvents,
} from "@openhotel/pixi-components";
import { HotBarItemsComponent } from "shared/components";
import { Event, SpriteSheetEnum } from "shared/enums";
import { usePrivateRoom, useProxy } from "shared/hooks";
import {
  CHAT_RIGHT_MARGIN,
  HOT_BAR_HEIGHT,
  MAX_MESSAGE_LENGTH,
  MAX_MESSAGES_HISTORY,
  STORAGE_KEY,
} from "shared/consts";
import { useTranslation } from "react-i18next";

type Props = {
  maxWidth: number;
  width: number;
};

export const ChatHotBarComponent: React.FC<Props> = ({
  maxWidth,
  width = 0,
}) => {
  const { t } = useTranslation();
  const { on } = useEvents();
  const { emit } = useProxy();
  const { scale } = useApplication();
  const { lastPositionData, absoluteRoomPosition } = usePrivateRoom();
  const { getPosition: getCursorPosition } = useCursor();

  const [focusInputNow, setFocusInputNow] = useState<number>(null);

  const [value, setValue] = useState<string>(null);

  const focusedRef = useRef<boolean>(false);
  const typingRef = useRef<boolean>(false);
  const typingTimeoutRef = useRef<number>(null);

  const historyRef = useRef<string[]>(
    JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
  );
  const historyIndexRef = useRef<number>(-1);

  const onKeyDown = useCallback(
    ({ code }: KeyboardEvent) => {
      if (code === "KeyC") return setFocusInputNow(performance.now());
    },
    [setFocusInputNow, setValue],
  );

  const onChangeMessage = useCallback(
    ({ code, target }: KeyboardEventExtended) => {
      const $message = target.value;

      if (code === "ArrowUp") {
        historyIndexRef.current = Math.min(
          historyRef.current.length - 1,
          historyIndexRef.current + 1,
        );
        setValue(historyRef.current[historyIndexRef.current]);
        return;
      }

      if (code === "ArrowDown") {
        historyIndexRef.current = Math.max(-1, historyIndexRef.current - 1);
        setValue(
          historyIndexRef.current >= 0
            ? historyRef.current[historyIndexRef.current]
            : "",
        );
        return;
      }
      if (code === "Enter") {
        let message = $message.trim();
        if (!message.length) return;
        historyIndexRef.current = -1;

        historyRef.current.unshift(message);
        if (historyRef.current.length > MAX_MESSAGES_HISTORY)
          historyRef.current.pop();

        localStorage.setItem(STORAGE_KEY, JSON.stringify(historyRef.current));

        //---- /set ------------------------------------------------------------
        if (
          message.startsWith("/set") &&
          message.split(" ").length === 2 &&
          lastPositionData
        ) {
          message += ` ${lastPositionData.position.x} ${lastPositionData.position.z} ${lastPositionData.direction}`;
          if (lastPositionData.wallPosition)
            message += ` ${lastPositionData.wallPosition.x} ${lastPositionData.wallPosition.y}`;
        }

        //---- /photo ------------------------------------------------------------
        if (message.startsWith("/photo") && message.split(" ").length === 1) {
          const cursor = getCursorPosition();
          const position = {
            x: Math.round(absoluteRoomPosition.x - cursor.x),
            y: Math.round(absoluteRoomPosition.y - cursor.y),
          };
          message += ` ${position.x} ${position.y} 256`;
        }

        emit(Event.MESSAGE, { message });
        setValue("");

        return;
      }
      setValue(target.value);

      if (!typingRef.current) {
        emit(Event.TYPING_START, {});
      }

      typingRef.current = true;
      clearTimeout(typingTimeoutRef.current);
      // @ts-ignore
      typingTimeoutRef.current = setTimeout(() => {
        typingRef.current = false;
        emit(Event.TYPING_END, {});
      }, 800);
    },
    [
      emit,
      setValue,
      lastPositionData,
      maxWidth,
      absoluteRoomPosition,
      scale,
      getCursorPosition,
    ],
  );

  const onFocus = useCallback(() => {
    focusedRef.current = true;
  }, []);

  const onBlur = useCallback(() => {
    focusedRef.current = false;
  }, []);

  useEffect(() => {
    const removeOnKeyDown = on(OhEvent.KEY_DOWN, onKeyDown);

    return () => {
      removeOnKeyDown();
    };
  }, [onKeyDown]);

  const startXPivot = useMemo(
    () => Math.round((maxWidth - width) / 2),
    [maxWidth, width],
  );

  return useMemo(
    () => (
      <ContainerComponent
        pivot={{
          y: HOT_BAR_HEIGHT,
        }}
      >
        <ContainerComponent pivot={{ x: startXPivot }}>
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={maxWidth}
            height={1}
            tint={1}
            pivot={{
              y: 2,
            }}
          />
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={maxWidth}
            height={1}
            tint={0x969696}
            pivot={{
              y: 1,
            }}
          />
          <GraphicsComponent
            type={GraphicType.RECTANGLE}
            width={maxWidth}
            height={HOT_BAR_HEIGHT}
            tint={0x4b4c4f}
          />
        </ContainerComponent>
        <ContainerComponent
          position={{
            x: 5,
            y: 8,
          }}
        >
          <NineSliceSpriteComponent
            texture="bubble-message"
            spriteSheet={SpriteSheetEnum.UI}
            leftWidth={7}
            rightWidth={7}
            topHeight={7}
            bottomHeight={7}
            width={width - CHAT_RIGHT_MARGIN + 20}
            tint={0xffffff}
          />
          <NineSliceSpriteComponent
            texture="bubble-message-ring"
            spriteSheet={SpriteSheetEnum.UI}
            leftWidth={7}
            rightWidth={7}
            topHeight={7}
            bottomHeight={7}
            width={width - CHAT_RIGHT_MARGIN + 20}
            tint={0}
          />
          <SpriteTextInputComponent
            width={width - CHAT_RIGHT_MARGIN}
            height={10}
            spriteSheet={SpriteSheetEnum.DEFAULT_FONT}
            padding={{
              left: 10,
              right: 10,
              top: 4,
              bottom: 0,
            }}
            placeholder={t("chat.hot_bar_placeholder")}
            placeholderProps={{
              color: 0x1,
              alpha: 0.5,
            }}
            maxLength={MAX_MESSAGE_LENGTH}
            backgroundColor={0xff00ff}
            backgroundAlpha={0}
            value={value}
            onChange={onChangeMessage}
            clearOnEnter={true}
            focusNow={focusInputNow}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </ContainerComponent>

        <ContainerComponent>
          <FlexContainerComponent
            justify={FLEX_JUSTIFY.END}
            align={FLEX_ALIGN.CENTER}
            size={{
              width,
              height: 30,
            }}
            pivot={{
              x: 10,
            }}
            gap={5}
          >
            <HotBarItemsComponent />
          </FlexContainerComponent>
        </ContainerComponent>
      </ContainerComponent>
    ),
    [
      startXPivot,
      maxWidth,
      width,
      value,
      onChangeMessage,
      focusInputNow,
      onFocus,
      onBlur,
    ],
  );
};
