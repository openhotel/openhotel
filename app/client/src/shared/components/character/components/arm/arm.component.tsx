import React, { useMemo } from "react";
import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  Direction,
} from "shared/enums";

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
  // return (
  //   <SpriteComponent
  //     texture={texture}
  //     spriteSheet={SpriteSheetEnum.CHARACTER}
  //     tint={skinColor}
  //     scale={{
  //       x: scale,
  //     }}
  //     zIndex={zIndex ?? 1}
  //     pivot={pivot}
  //   />
  // );
  return null;
};
