import React, { useMemo } from "react";
import {
  CharacterBodyAction,
  CharacterPart,
  Direction,
  SpriteSheetEnum,
} from "shared/enums";
import { ContainerComponent, SpriteComponent } from "@oh/pixi-components";
import { getCharacterBodyPart } from "shared/utils";
import { useCharacter } from "shared/hooks";
import {
  CHARACTER_DIRECTION_MAP,
  CHARACTER_DIRECTION_SCALE_MAP,
} from "shared/consts";

type Props = {
  direction: Direction;
  action: CharacterBodyAction;
  children?: React.ReactNode;
  skinColor: number;
};

export const BodyComponent: React.FC<Props> = ({
  action,
  direction,
  children,
  skinColor,
}) => {
  const { getBodyData } = useCharacter();

  const { scale, texture, pivot } = useMemo(() => {
    const characterDirection = CHARACTER_DIRECTION_MAP[direction];
    const scale = CHARACTER_DIRECTION_SCALE_MAP[direction];

    const { pivot } = getBodyData(direction, action);
    const texture = getCharacterBodyPart(
      CharacterPart.BODY,
      characterDirection,
      action,
    );

    return {
      scale,
      texture,
      pivot,
    };
  }, [direction, action]);

  return (
    <ContainerComponent sortableChildren pivot={pivot}>
      <SpriteComponent
        texture={texture}
        spriteSheet={SpriteSheetEnum.CHARACTER}
        tint={skinColor}
        scale={{
          x: scale,
        }}
      />
      {children}
    </ContainerComponent>
  );
};
