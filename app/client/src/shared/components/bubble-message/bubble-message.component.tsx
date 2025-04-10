import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  ContainerRef,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  NineSliceSpriteComponent,
} from "@oh/pixi-components";
import { TextComponent } from "shared/components/text";
import { SpriteSheetEnum } from "shared/enums";
import { TILE_SIZE } from "shared/consts";

type Props = {
  username: string;
  message: string;

  borderColor?: number;
  backgroundColor?: number;

  usernameColor?: number;
  messageColor?: number;

  align?: "left" | "center";
} & ContainerProps;

export const BubbleMessageComponent: React.FC<Props> = ({
  username,
  message,

  borderColor,
  backgroundColor,

  usernameColor,
  messageColor,

  align = "left",

  ...containerProps
}) => {
  const userContainerRef = useRef<ContainerRef>(null);
  const messageContainerRef = useRef<ContainerRef>(null);

  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    setWidth(
      userContainerRef.current.getSize().width +
        messageContainerRef.current.getSize().width +
        30,
    );
  }, [setWidth]);

  const pivotX = useMemo(
    () =>
      (align === "left" ? 0 : Math.round(width / 2)) +
      //align with tile
      -TILE_SIZE.width / 2 -
      //tile fix
      1,
    [width, align],
  );

  return (
    <ContainerComponent
      {...containerProps}
      pivot={{
        x: pivotX,
      }}
      //prevents flickering
      visible={Boolean(width)}
    >
      <NineSliceSpriteComponent
        texture="bubble-message"
        spriteSheet={SpriteSheetEnum.UI}
        leftWidth={7}
        rightWidth={7}
        topHeight={7}
        bottomHeight={7}
        width={width}
        tint={backgroundColor ?? 0xffffff}
      />
      <NineSliceSpriteComponent
        texture="bubble-message-ring"
        spriteSheet={SpriteSheetEnum.UI}
        leftWidth={7}
        rightWidth={7}
        topHeight={7}
        bottomHeight={7}
        width={width}
        tint={borderColor ?? 0}
      />
      <FlexContainerComponent
        position={{
          x: -1,
          y: 4,
        }}
        justify={FLEX_JUSTIFY.CENTER}
        size={{
          width: width,
          height: 6,
        }}
      >
        <TextComponent
          ref={userContainerRef}
          text={username}
          tint={usernameColor ?? 0}
          bold
        />
        <TextComponent pivot={{ x: -1 }} text=": " tint={usernameColor ?? 0} />
        <TextComponent
          ref={messageContainerRef}
          text={message}
          tint={messageColor ?? 0}
        />
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
