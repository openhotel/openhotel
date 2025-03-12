import React, { useMemo } from "react";
import {
  CharacterBodyAction,
  CharacterDirection,
  CharacterPart,
  Direction,
  SpriteSheetEnum,
} from "shared/enums";
import { SpriteComponent } from "@oh/pixi-components";
import { useCharacter } from "shared/hooks";
import { CharacterDirectionData } from "shared/types";
import { getCharacterBodyPart, getEnumKeyLowCase } from "shared/utils";

type Props = {
  bodyDirection: Direction;
  bodyAction: CharacterBodyAction;
  direction: Direction;
  skinColor: number;
};

export const HeadComponent: React.FC<Props> = ({
  bodyDirection,
  bodyAction,
  direction,
  skinColor,
}) => {
  const { data } = useCharacter();

  const { texture, scale, pivot } = useMemo(() => {
    const { frames, scale, target }: CharacterDirectionData =
      data[getEnumKeyLowCase(bodyDirection, Direction)];

    const { pivot } =
      frames[getEnumKeyLowCase(bodyAction, CharacterBodyAction)].head;

    const texture = getCharacterBodyPart(
      CharacterPart.HEAD,
      CharacterDirection[
        (target ?? Direction[bodyDirection]).toUpperCase()
      ] as any,
    );

    return {
      scale,
      texture,
      pivot,
    };
  }, [direction, bodyDirection, bodyAction]);

  return (
    <SpriteComponent
      texture={texture}
      spriteSheet={SpriteSheetEnum.CHARACTER}
      scale={{
        x: scale,
      }}
      pivot={pivot}
      tint={skinColor}
      zIndex={2}
    />
  );
};
