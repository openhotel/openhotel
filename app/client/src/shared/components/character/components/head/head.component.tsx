import React, { useMemo } from "react";
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

  const { texture, scale, pivot } = useMemo(() => {
    const bodyDirectionString = getEnumKeyLowCase(bodyDirection, Direction);
    const bodyActionString = getEnumKeyLowCase(bodyAction, CharacterBodyAction);

    const baseBodyData: CharacterDirectionData = data[bodyDirectionString];
    const coreBodyData: CharacterDirectionData = data[baseBodyData?.target];

    const baseData = baseBodyData?.frames?.[bodyActionString];
    const coreData = coreBodyData?.frames?.[bodyActionString];

    const headBodyDirection =
      CharacterDirection[
        (baseBodyData?.target ?? Direction[bodyDirection])?.toUpperCase()
      ];

    const texture = getCharacterBodyPart(CharacterPart.HEAD, headBodyDirection);

    const pivot = {
      x: (coreData?.head?.pivot?.x ?? 0) + (baseData?.head?.pivot?.x ?? 0),
      y: (coreData?.head?.pivot?.y ?? 0) + (baseData?.head?.pivot?.y ?? 0),
    };

    return {
      scale: coreBodyData?.scale ?? baseBodyData?.scale,
      texture,
      pivot,
    };
  }, [bodyDirection, bodyAction, data]);

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
