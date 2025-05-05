import React, { useMemo } from "react";
import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  CharacterDirection,
  CharacterPart,
  Direction,
  SpriteSheetEnum,
} from "shared/enums";
import { useCharacter } from "shared/hooks";
import { CharacterDirectionData } from "shared/types";
import { getCharacterBodyPart, getEnumKeyLowCase } from "shared/utils";
import { SpriteComponent } from "@openhotel/pixi-components";

type Props = {
  skinColor: number;

  bodyDirection: Direction;
  bodyAction: CharacterBodyAction;

  side: CharacterArmSide;
  action: CharacterArmAction;
};

export const ArmComponent: React.FC<Props> = ({
  skinColor,
  bodyDirection,
  bodyAction,
  side,
  action,
}) => {
  const { data } = useCharacter();

  const { texture, scale, pivot, zIndex, visible } = useMemo(() => {
    const {
      frames,
      target: bodyTarget,
      scale: bodyScale,
    }: CharacterDirectionData = data[
      getEnumKeyLowCase(bodyDirection, Direction)
    ];

    const baseBodyData =
      frames[getEnumKeyLowCase(bodyAction, CharacterBodyAction)];

    const $armSide = `${getEnumKeyLowCase(side, CharacterArmSide)}_arm`;
    const baseArmData = baseBodyData[$armSide];

    const coreArmData =
      action !== CharacterArmAction.IDLE
        ? frames[getEnumKeyLowCase(action, CharacterArmAction)]?.[$armSide]
        : null;

    const pivot = {
      x: (baseArmData?.pivot?.x ?? 0) + (coreArmData?.pivot?.x ?? 0),
      y: (baseArmData?.pivot?.y ?? 0) + (coreArmData?.pivot?.y ?? 0),
    };

    const scale = coreArmData?.scale ?? baseArmData?.scale ?? bodyScale ?? 1;

    let $side = baseArmData?.target
      ? baseArmData?.target?.includes("right")
        ? CharacterArmSide.RIGHT
        : CharacterArmSide.LEFT
      : side;

    if (bodyScale === -1)
      $side =
        $side === CharacterArmSide.LEFT
          ? CharacterArmSide.RIGHT
          : CharacterArmSide.LEFT;

    const texture = getCharacterBodyPart(
      CharacterPart.ARM,
      CharacterDirection[
        (bodyTarget ?? Direction[bodyDirection]).toUpperCase()
      ],
      $side,
      action,
    );

    return {
      scale,
      texture,
      pivot,
      zIndex: coreArmData?.zIndex ?? baseArmData?.zIndex ?? 1,
      visible: coreArmData?.visible ?? baseArmData?.visible ?? true,
    };
  }, [bodyDirection, bodyAction, action]);

  return useMemo(
    () =>
      //DO NOT CHANGE TO !visible
      visible === false ? null : (
        <SpriteComponent
          texture={texture}
          spriteSheet={SpriteSheetEnum.CHARACTER}
          tint={skinColor}
          scale={{
            x: scale,
          }}
          zIndex={zIndex}
          pivot={pivot}
        />
      ),
    [texture, scale, zIndex, pivot],
  );
};
