import React, { useCallback, useMemo, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
  FLEX_ALIGN,
  FLEX_JUSTIFY,
  FlexContainerComponent,
  NineSliceSpriteComponent,
  Size,
  useText,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components/text";

type BaseProps = ContainerProps & {
  text: string;
  color?: number;
};

type Props =
  | (BaseProps & {
      autoWidth: true;
      size?: Omit<Size, "width">;
    })
  | (BaseProps & {
      autoWidth?: false;
      size?: Size;
    });

export const ButtonComponent: React.FC<Props> = ({
  text,
  size = { height: 14 },
  color,
  autoWidth,
  ...containerProps
}) => {
  const [texture, setTexture] = useState("ui-button");

  const onPointerEnter = useCallback(() => setTexture("ui-button-gray"), []);
  const onPointerLeave = useCallback(() => setTexture("ui-button"), []);

  const { getTextLength } = useText(SpriteSheetEnum.DEFAULT_FONT);

  // @ts-ignore
  const width = useMemo(
    () => (autoWidth ? getTextLength(text) + 16 : (size as Size).width),
    [autoWidth, getTextLength, size],
  );

  return (
    <ContainerComponent
      {...containerProps}
      eventMode={EventMode.STATIC}
      cursor={Cursor.POINTER}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      <NineSliceSpriteComponent
        spriteSheet={SpriteSheetEnum.UI}
        texture={texture}
        leftWidth={3}
        rightWidth={3}
        topHeight={3}
        bottomHeight={3}
        width={width}
        height={size.height}
      />
      <FlexContainerComponent
        size={{ width: width, height: size.height }}
        justify={FLEX_JUSTIFY.CENTER}
        align={FLEX_ALIGN.CENTER}
      >
        <TextComponent text={text} color={color ?? 0} />
      </FlexContainerComponent>
    </ContainerComponent>
  );
};
