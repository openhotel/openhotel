import React from "react";
import {
  CharacterBodyAction,
  CharacterBodyAnimation,
  Direction,
} from "shared/enums";
import { useCharacter } from "shared/hooks";
import { getEnumKeyLowCase } from "shared/utils";

type Props = {
  direction: Direction;
  animation: CharacterBodyAnimation;
  children?: React.ReactNode;
  skinColor: number;
};

export const BodyComponent: React.FC<Props> = ({
  animation,
  direction,
  children,
  skinColor,
}) => {
  const { data } = useCharacter();

  // const { scale, texture, pivot } = useMemo(() => {
  //   const characterDirection = CHARACTER_DIRECTION_MAP[direction];
  //   const scale = CHARACTER_DIRECTION_SCALE_MAP[direction];
  //
  //   const { pivot } = getBodyData(direction, action);
  //   const texture = getCharacterBodyPart(
  //     CharacterPart.BODY,
  //     characterDirection,
  //     action,
  //   );
  //
  //   return {
  //     scale,
  //     texture,
  //     pivot,
  //   };
  // }, [direction, action]);

  console.log(
    data[getEnumKeyLowCase(direction, Direction)].animations[
      getEnumKeyLowCase(animation, CharacterBodyAnimation)
    ],
  );

  return null;
  // return (
  //   <ContainerComponent sortableChildren pivot={pivot}>
  //     <SpriteComponent
  //       texture={texture}
  //       spriteSheet={SpriteSheetEnum.CHARACTER}
  //       tint={skinColor}
  //       scale={{
  //         x: scale,
  //       }}
  //     />
  //     {children}
  //   </ContainerComponent>
  // );
};
