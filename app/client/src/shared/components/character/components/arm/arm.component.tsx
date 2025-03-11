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
import { SpriteComponent } from "@oh/pixi-components";

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
    const { frames }: CharacterDirectionData =
      data[getEnumKeyLowCase(bodyDirection, Direction)];

    const bodyActionData =
      frames[getEnumKeyLowCase(bodyAction, CharacterBodyAction)];

    const { target, visible, zIndex, pivot, scale } =
      bodyActionData[`${getEnumKeyLowCase(side, CharacterArmSide)}_arm`];

    const targetData = bodyActionData[target];

    const texture = getCharacterBodyPart(
      CharacterPart.ARM,
      CharacterDirection[Direction[bodyDirection].toUpperCase()] as any,
      target
        ? target.includes("right")
          ? CharacterArmSide.RIGHT
          : CharacterArmSide.LEFT
        : side,
      action,
    );

    return {
      scale,
      texture,
      pivot,
      zIndex: targetData?.zIndex ?? zIndex ?? 1,
      visible,
    };
  }, [bodyDirection, bodyAction]);

  //DO NOT CHANGE TO !visible
  if (visible === false) return null;

  console.log(texture);
  // const { getArmData } = useCharacter();
  //
  // const characterDirection = useMemo(
  //   () => CHARACTER_DIRECTION_MAP[bodyDirection],
  //   [bodyDirection],
  // );
  // const armSide = useMemo(
  //   () => CHARACTER_ARM_SIDE_MAP[bodyDirection][side],
  //   [bodyDirection, side],
  // );
  // const scale = useMemo(
  //   () =>
  //     side === armSide ? CHARACTER_DIRECTION_SCALE_MAP[bodyDirection] : -1,
  //   [side, armSide, bodyDirection],
  // );
  //
  // const texture = useMemo(
  //   () =>
  //     getCharacterBodyPart(
  //       CharacterPart.ARM,
  //       characterDirection,
  //       armSide,
  //       action,
  //     ),
  //   [characterDirection, action, armSide],
  // );
  //
  // const { pivot, zIndex, visible } = useMemo(() => {
  //   return getArmData(bodyDirection, bodyAction, side);
  // }, [getArmData, bodyDirection, bodyAction, side]);
  //
  // //Do not change to "!visible"
  // if (visible === false) return null;
  //
  return (
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
  );
};
