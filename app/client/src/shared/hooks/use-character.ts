import { useAssets } from ".";
import { useMemo } from "react";
import { AssetEnum } from "shared/enums";
import { CharacterFixesData, CharacterFramesData } from "shared/types";

export const useCharacter = () => {
  const { getAsset } = useAssets();

  const data: CharacterFramesData = useMemo(
    () => getAsset(AssetEnum.CHARACTER_DATA) as CharacterFramesData,
    [getAsset],
  );

  const dataFixes: CharacterFixesData = useMemo(
    () => getAsset(AssetEnum.CHARACTER_DATA_FIXES) as CharacterFixesData,
    [getAsset],
  );

  return {
    data,
    dataFixes,
    // getBodyData,
    // getHeadData,
    // getArmData,
  };
};
