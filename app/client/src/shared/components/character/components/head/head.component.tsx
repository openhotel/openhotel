import React, { useMemo } from "react";
import {
  CharacterBodyAction,
  CharacterPart,
  Direction,
  SpriteSheetEnum,
} from "shared/enums";
import { SpriteComponent } from "@oh/pixi-components";
import { getCharacterBodyPart } from "shared/utils";
import {
  CHARACTER_DIRECTION_MAP,
  CHARACTER_DIRECTION_SCALE_MAP,
} from "shared/consts";
import { useCharacter } from "shared/hooks";

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
  const { getHeadData } = useCharacter();

  const characterDirection = useMemo(
    () => CHARACTER_DIRECTION_MAP[direction],
    [direction],
  );

  const scale = useMemo(
    () => CHARACTER_DIRECTION_SCALE_MAP[direction],
    [direction],
  );

  const texture = useMemo(
    () => getCharacterBodyPart(CharacterPart.HEAD, characterDirection),
    [characterDirection],
  );

  const { pivot } = useMemo(() => {
    return getHeadData(bodyDirection, bodyAction, direction);
  }, [getHeadData, bodyDirection, bodyAction, direction]);

  return (
    <SpriteComponent
      texture={texture}
      spriteSheet={SpriteSheetEnum.CHARACTER}
      scale={{
        x: scale,
      }}
      pivot={pivot}
      tint={skinColor}
    />
  );
};
