import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
  FlexContainerComponent,
  KeyboardEventExtended,
  NineSliceSpriteComponent,
  Size,
  SpriteComponent,
  usePointerOutside,
} from "@openhotel/pixi-components";
import { SpriteSheetEnum } from "shared/enums";
import { TextComponent } from "shared/components/text";

export type SelectorOption = {
  key: string;
  value: string;
};

type Props = {
  autoWidth?: false;
  size: Size;
  children?: React.ReactNode;
  options: SelectorOption[];
  onChange?: (value: KeyboardEventExtended) => void;
} & ContainerProps;

const HEIGHT = 14;

export const SelectorComponent: React.FC<Props> = ({
  size,
  autoWidth,
  children,
  options,
  onChange,
  ...containerProps
}) => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState(options[0] ?? null);

  useEffect(() => {
    setSelectedOption(options[0]);
  }, [options, setSelectedOption]);

  const onClickOption = useCallback(
    (option: SelectorOption) => () => {
      setSelectedOption(option);
      setShowOptions(false);
    },
    [setSelectedOption, setShowOptions],
  );

  const onPointerOutside = useCallback(() => {
    setShowOptions(false);
  }, [setShowOptions]);

  const pointerOutside = usePointerOutside(onPointerOutside);

  const renderOptions = useMemo(() => {
    return options.map((option, index) => (
      <ContainerComponent
        key={option.key}
        cursor={Cursor.POINTER}
        eventMode={EventMode.STATIC}
        onPointerDown={onClickOption(option)}
      >
        <NineSliceSpriteComponent
          texture="selector-item"
          spriteSheet={SpriteSheetEnum.UI}
          leftWidth={2}
          rightWidth={2}
          topHeight={2}
          bottomHeight={2}
          width={size.width - 2}
          height={HEIGHT - 1}
          scale={{
            y: -1,
          }}
          position={{
            x: 1,
            y: 1,
          }}
        />
        <TextComponent
          text={option.value}
          color={0}
          padding={{
            top: 5,
            left: 6,
            right: 6,
          }}
          alpha={selectedOption.key === option.key ? 1 : 0.25}
        />
      </ContainerComponent>
    ));
  }, [options, onClickOption, selectedOption]);

  const onToggleOptions = useCallback(() => {
    setShowOptions((showOptions) => !showOptions);
  }, [setShowOptions]);

  return (
    <>
      <ContainerComponent
        {...containerProps}
        {...pointerOutside}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onToggleOptions}
      >
        <NineSliceSpriteComponent
          texture="input"
          spriteSheet={SpriteSheetEnum.UI}
          leftWidth={2}
          rightWidth={2}
          topHeight={2}
          bottomHeight={2}
          width={size.width}
          height={HEIGHT}
          scale={{
            y: -1,
          }}
        />
        <TextComponent
          text={selectedOption.value}
          color={0}
          padding={{
            top: 4,
            left: 6,
            right: 6,
          }}
        />

        <SpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="arrow-x2"
          tint={0}
          angle={90}
          position={{
            x: size.width - 4,
            y: 5,
          }}
        />
        <SpriteComponent
          spriteSheet={SpriteSheetEnum.UI}
          texture="input-dots"
          tint={0xc9c9c9}
          position={{
            x: size.width - 15,
            y: 2,
          }}
        />
      </ContainerComponent>
      {showOptions ? (
        <ContainerComponent
          position={{
            x: containerProps.position?.x ?? 0,
            y: HEIGHT + 1 + (containerProps.position?.y ?? 0),
          }}
        >
          <NineSliceSpriteComponent
            texture="input"
            spriteSheet={SpriteSheetEnum.UI}
            leftWidth={2}
            rightWidth={2}
            topHeight={2}
            bottomHeight={2}
            width={size.width}
            height={HEIGHT * options.length + 2 - options.length}
            scale={{
              y: -1,
            }}
          />
          <FlexContainerComponent direction="y">
            {renderOptions}
          </FlexContainerComponent>
        </ContainerComponent>
      ) : null}
    </>
  );
};
