import React, { useCallback, useEffect, useState } from "react";
import {
  ContainerComponent,
  Event as OhEvent,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  GraphicsComponent,
  GraphicType,
  Size,
  SpriteTextInputComponent,
  useEvents,
  useWindow,
} from "@oh/pixi-components";
import { HotBarItemsComponent } from "shared/components";
import { Event, SpriteSheetEnum } from "shared/enums";
import { useProxy } from "shared/hooks";

export const ChatHotBarComponent: React.FC = () => {
  const { getSize } = useWindow();
  const { on } = useEvents();
  const { emit } = useProxy();

  const [windowSize, setWindowSize] = useState<Size>(getSize());

  useEffect(() => {
    const removeOnResize = on(OhEvent.RESIZE, setWindowSize);

    return () => {
      removeOnResize();
    };
  }, [on]);

  const onSendChatMessage = useCallback(
    (message: string) => {
      emit(Event.MESSAGE, { message });
    },
    [emit],
  );

  return (
    <ContainerComponent
      position={{
        y: windowSize.height - 32,
      }}
    >
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={windowSize.width}
        height={1}
        tint={1}
        pivot={{
          y: 2,
        }}
      />
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={windowSize.width}
        height={1}
        tint={0xb0b0b0}
        pivot={{
          y: 1,
        }}
      />
      <GraphicsComponent
        type={GraphicType.RECTANGLE}
        width={windowSize.width}
        height={32}
        tint={0x525457}
      />
      <SpriteTextInputComponent
        width={windowSize.width - 185}
        height={10}
        spriteSheet={SpriteSheetEnum.DEFAULT_FONT}
        position={{
          x: 5,
          y: 8,
        }}
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
        onEnter={onSendChatMessage}
        clearOnEnter={true}
      />
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

// <ContainerComponent>

// </ContainerComponent>
