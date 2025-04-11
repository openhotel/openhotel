import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ContainerComponent,
  Event as OhEvent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  NineSliceSpriteComponent,
  SpriteTextInputComponent,
  useEvents,
} from "@openhotel/pixi-components";
import { HotBarItemsComponent } from "shared/components";
import { Event, SpriteSheetEnum } from "shared/enums";
import { useProxy } from "shared/hooks";
import {
  CHAT_RIGHT_MARGIN,
  HOT_BAR_HEIGHT,
  MAX_MESSAGE_LENGTH,
  MAX_MESSAGES_HISTORY,
  STORAGE_KEY,
} from "shared/consts";

type Props = {
  width: number;
};

export const ChatHotBarComponent: React.FC<Props> = ({ width = 0 }) => {
  const { on } = useEvents();
  const { emit } = useProxy();

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

      if (!focusedRef.current || 0 >= historyRef.current.length) return;

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
    },
    [setFocusInputNow, setValue],
  );

  useEffect(() => {
    const removeOnKeyDown = on(OhEvent.KEY_DOWN, onKeyDown);

    return () => {
      removeOnKeyDown();
    };
  }, [on, onKeyDown]);

  const onChangeMessage = useCallback((message: string) => {
    if (message.startsWith("/")) return;
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
  }, []);

  const onSendMessage = useCallback(
    ($message: string) => {
      const message = $message.trim();
      if (!message.length) return;
      historyIndexRef.current = -1;

      historyRef.current.unshift(message);
      if (historyRef.current.length > MAX_MESSAGES_HISTORY)
        historyRef.current.pop();

      localStorage.setItem(STORAGE_KEY, JSON.stringify(historyRef.current));

      emit(Event.MESSAGE, { message });
      setValue(null);
    },
    [emit, setValue],
  );

  const onFocus = useCallback(() => {
    focusedRef.current = true;
  }, []);

  const onBlur = useCallback(() => {
    focusedRef.current = false;
  }, []);

  return (
    <ContainerComponent
      pivot={{
        y: HOT_BAR_HEIGHT,
      }}
    >
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={width}
        height={1}
        tint={1}
        pivot={{
          y: 2,
        }}
      />
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={width}
        height={1}
        tint={0x969696}
        pivot={{
          y: 1,
        }}
      />
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={width}
        height={HOT_BAR_HEIGHT}
        tint={0x4b4c4f}
      />
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
          placeholder="Click here or press 'c' to write a message"
          placeholderProps={{
            color: 0x1,
            alpha: 0.5,
          }}
          maxLength={MAX_MESSAGE_LENGTH}
          backgroundColor={0xff00ff}
          backgroundAlpha={0}
          onEnter={onSendMessage}
          onValueChange={onChangeMessage}
          clearOnEnter={true}
          focusNow={focusInputNow}
          onFocus={onFocus}
          onBlur={onBlur}
          value={value}
        />
      </ContainerComponent>

      <FlexContainerComponent
        justify={FLEX_JUSTIFY.END}
        align={FLEX_ALIGN.CENTER}
        size={{
          height: 30,
        }}
        gap={5}
        pivot={{
          x: 10,
        }}
      >
        <HotBarItemsComponent />
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
