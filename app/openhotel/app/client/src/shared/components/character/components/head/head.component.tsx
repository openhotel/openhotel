import React, { useCallback, useMemo } from "react";
import {
  CharacterBodyAction,
  CharacterDirection,
  CharacterPart,
  Direction,
  SpriteSheetEnum,
} from "shared/enums";
import { SpriteComponent } from "@openhotel/pixi-components";
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
  const { data, dataFixes } = useCharacter();

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
    if (bodyDirection === direction) return getDataFromDirection(bodyDirection);
    const headData = getDataFromDirection(direction);

    const foundFix = dataFixes.find(({ match }) =>
      match.some(
        ($match) =>
          $match?.body?.direction ===
            getEnumKeyLowCase(bodyDirection, Direction).toLowerCase() &&
          $match?.body?.action ===
            getEnumKeyLowCase(bodyAction, CharacterBodyAction).toLowerCase() &&
          $match?.head?.direction ===
            getEnumKeyLowCase(direction, Direction).toLowerCase(),
      ),
    );

    return {
      ...headData,
      pivot: {
        x: headData.pivot.x + (foundFix?.exec?.head?.pivot?.x ?? 0),
        y: headData.pivot.y + (foundFix?.exec?.head?.pivot?.y ?? 0),
      },
    };
  }, [getDataFromDirection, data, dataFixes, bodyDirection, direction]);

  return useMemo(
    () => (
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
    ),
    [texture, scale, pivot, skinColor],
  );
};
