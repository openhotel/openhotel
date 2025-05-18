import React, { useCallback, useMemo } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
  KeyboardEventExtended,
  NineSliceSpriteComponent,
  Sides,
  Size,
  SpriteTextInputComponent,
  useUpdate,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";

type Props = {
  size: Partial<Size>;
  padding?: Partial<Sides>;
  children?: React.ReactNode;
  placeholder?: string;
  value?: string;
  maxLength?: number;
  onChange?: (value: KeyboardEventExtended) => void;
} & ContainerProps;

export const InputComponent: React.FC<Props> = ({
  size,
  children,
  padding,
  placeholder,
  value,
  onChange,
  maxLength,
  ...containerProps
}) => {
  const { lastUpdate, update } = useUpdate();

  const $padding = useMemo(
    () => ({
      top: 5 + (padding?.top ?? 0),
      left: 6 + (padding?.left ?? 0),
      right: 6 + (padding?.right ?? 0),
    }),
    [padding],
  );

  const onClickChildren = useCallback(() => {
    update();
  }, [update]);

  return (
    <ContainerComponent {...containerProps}>
      <NineSliceSpriteComponent
        texture="input"
        spriteSheet={SpriteSheetEnum.UI}
        leftWidth={2}
        rightWidth={2}
        topHeight={2}
        bottomHeight={2}
        width={size.width}
        height={size?.height ?? 14}
      />
      <SpriteTextInputComponent
        width={size.width - $padding.left - $padding.right}
        height={10}
        spriteSheet={SpriteSheetEnum.DEFAULT_FONT}
        padding={$padding}
        placeholder={placeholder}
        placeholderProps={{
          color: 0xe0e0e0,
        }}
        backgroundAlpha={0}
        maxLength={maxLength}
        value={value}
        focusNow={lastUpdate}
        onChange={onChange}
        color={0}
      />
      {children ? (
        <ContainerComponent
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
          onPointerDown={onClickChildren}
        >
          {children}
        </ContainerComponent>
      ) : null}
    </ContainerComponent>
  );
};
