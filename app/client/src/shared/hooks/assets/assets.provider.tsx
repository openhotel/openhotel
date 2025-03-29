import React, { ReactNode, useCallback } from "react";
import { AssetsContext } from "./assets.context";
import { AssetEnum } from "shared/enums";
import { useAssetsStore } from "./assets.store";

type AssetsProps = {
  children: ReactNode;
};

export const AssetsProvider: React.FunctionComponent<AssetsProps> = ({
  children,
}) => {
  const { setAsset: $setAsset, getAsset: $getAsset } = useAssetsStore();

  const getAsset = useCallback(
    (assetKey: AssetEnum) => $getAsset(assetKey) as any,
    [$getAsset],
  );
  const setAsset = useCallback(
    (assetKey: AssetEnum, data: unknown) => {
      $setAsset(assetKey, data);
    },
    [$setAsset],
  );

  return (
    <AssetsContext.Provider
      value={{
        getAsset,
        setAsset,
      }}
      children={children}
    />
  );
};
