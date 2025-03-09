import React, { useMemo } from "react";
import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterDirection,
  CharacterPart,
  SpriteSheetEnum,
} from "shared/enums";
import { SpriteComponent } from "@oh/pixi-components";
import { getCharacterBodyPart } from "shared/utils";

type Props = {
  skinColor: number;

  bodyDirection: CharacterDirection;
  bodyScale: number;

  side: CharacterArmSide;
  action: CharacterArmAction;
};

export const ArmComponent: React.FC<Props> = ({
  skinColor,
  bodyDirection,
  bodyScale,
  side,
  action,
}) => {
  const texture = useMemo(
    () => getCharacterBodyPart(CharacterPart.ARM, bodyDirection, side, action),
    [bodyDirection, action, side],
  );
  return (
    <SpriteComponent
      texture={texture}
      spriteSheet={SpriteSheetEnum.CHARACTER}
      tint={skinColor}
      scale={{
        x: bodyScale,
      }}
    />
  );
};
