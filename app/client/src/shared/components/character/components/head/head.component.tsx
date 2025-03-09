import React, { useMemo } from "react";
import {
  CharacterDirection,
  CharacterPart,
  SpriteSheetEnum,
} from "shared/enums";
import { SpriteComponent } from "@oh/pixi-components";
import { getCharacterBodyPart } from "shared/utils";

type Props = {
  direction: CharacterDirection;
  skinColor: number;
  scale: number;
};

export const HeadComponent: React.FC<Props> = ({
  direction,
  skinColor,
  scale,
}) => {
  const texture = useMemo(
    () => getCharacterBodyPart(CharacterPart.HEAD, direction),
    [],
  );

  return (
    <SpriteComponent
      texture={texture}
      spriteSheet={SpriteSheetEnum.CHARACTER}
      scale={{
        x: scale,
      }}
      tint={skinColor}
    />
  );
};
