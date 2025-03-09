import { useAssets } from ".";
import { useCallback, useMemo } from "react";
import {
  AssetEnum,
  CharacterArmSide,
  CharacterBodyAction,
  CharacterPart,
  Direction,
} from "shared/enums";
import { getEnumKeyLowCase } from "shared/utils";
import {
  CharacterArmData,
  CharacterBodyData,
  CharacterHeadData,
} from "shared/types";

export const useCharacter = () => {
  const { getAsset } = useAssets();

  const data = useMemo(() => getAsset(AssetEnum.CHARACTER_DATA), [getAsset]);

  const getData = useCallback(
    (
      direction: Direction,
      action: CharacterBodyAction,
      part: CharacterPart,
    ) => {
      return data[getEnumKeyLowCase(direction, Direction)][
        getEnumKeyLowCase(action, CharacterBodyAction)
      ][getEnumKeyLowCase(part, CharacterPart)];
    },
    [data],
  );

  const getBodyData = useCallback(
    (
      direction: Direction,
      bodyAction: CharacterBodyAction,
    ): CharacterBodyData => getData(direction, bodyAction, CharacterPart.BODY),
    [getData],
  );

  const getHeadData = useCallback(
    (
      direction: Direction,
      bodyAction: CharacterBodyAction,
      headDirection: Direction,
    ): CharacterHeadData => {
      const headData = getData(direction, bodyAction, CharacterPart.HEAD);
      return (
        headData[getEnumKeyLowCase(headDirection, Direction)] ??
        headData[getEnumKeyLowCase(direction, Direction)]
      );
    },
    [getData],
  );

  const getArmData = useCallback(
    (
      direction: Direction,
      bodyAction: CharacterBodyAction,
      armSide: CharacterArmSide,
    ): CharacterArmData =>
      getData(direction, bodyAction, CharacterPart.ARM)[
        getEnumKeyLowCase(armSide, CharacterArmSide)
      ],
    [getData],
  );

  return {
    getBodyData,
    getHeadData,
    getArmData,
  };
};
