import React, { useCallback, useMemo } from "react";
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

  const getDataFromDirection = useCallback(
    ($direction: Direction) => {
      const bodyDirectionString = getEnumKeyLowCase($direction, Direction);
      const bodyActionString = getEnumKeyLowCase(
        bodyAction,
        CharacterBodyAction,
      );

      const baseBodyData: CharacterDirectionData = data[bodyDirectionString];
      const coreBodyData: CharacterDirectionData = data[baseBodyData?.target];

      const baseData = baseBodyData?.frames?.[bodyActionString];
      const coreData = coreBodyData?.frames?.[bodyActionString];

      const headBodyDirection =
        CharacterDirection[
          (baseBodyData?.target ?? Direction[$direction])?.toUpperCase()
        ];

      const texture = getCharacterBodyPart(
        CharacterPart.HEAD,
        headBodyDirection,
      );

      const pivot = {
        x: (baseData?.head?.pivot?.x ?? 0) + (coreData?.head?.pivot?.x ?? 0),
        y: (baseData?.head?.pivot?.y ?? 0) + (coreData?.head?.pivot?.y ?? 0),
      };

      const scale = coreBodyData?.scale ?? baseBodyData?.scale;

      return {
        scale,
        texture,
        pivot,
      };
    },
    [bodyAction, data, bodyDirection, direction],
  );

  const { texture, scale, pivot } = useMemo(() => {
    const bodyData = getDataFromDirection(bodyDirection);
    const headData = getDataFromDirection(direction);

    return bodyDirection !== direction ? headData : bodyData;
  }, [getDataFromDirection, data, bodyDirection, direction]);

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
