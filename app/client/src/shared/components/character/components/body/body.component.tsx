import React, { useMemo } from "react";
import {
  CharacterBodyAction,
  CharacterDirection,
  CharacterPart,
  Direction,
  SpriteSheetEnum,
} from "shared/enums";
import { useCharacter } from "shared/hooks";
import { getCharacterBodyPart, getEnumKeyLowCase } from "shared/utils";
import { CharacterDirectionData } from "shared/types";
import { ContainerComponent, SpriteComponent } from "@oh/pixi-components";

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
  const { data } = useCharacter();

  const bodyData = useMemo(() => {
    const { frames, scale, target }: CharacterDirectionData =
      data[getEnumKeyLowCase(direction, Direction)];

    const bodyData = frames[getEnumKeyLowCase(action, CharacterBodyAction)];

    if (!bodyData) return null;

    const texture = getCharacterBodyPart(
      CharacterPart.BODY,
      CharacterDirection[(target ?? Direction[direction]).toUpperCase()] as any,
      action,
    );

    return {
      scale,
      texture,
      pivot: bodyData.body.pivot,
      position: bodyData.body.position,
    };
  }, [direction, action]);

  if (!bodyData) return null;

  return (
    <ContainerComponent sortableChildren pivot={bodyData.position}>
      <SpriteComponent
        texture={bodyData.texture}
        spriteSheet={SpriteSheetEnum.CHARACTER}
        tint={skinColor}
        scale={{
          x: bodyData.scale ?? 1,
        }}
        pivot={{
          x: bodyData?.pivot?.x ?? 0,
          y: bodyData?.pivot?.y ?? 0,
        }}
      />
      {children}
    </ContainerComponent>
  );
};
