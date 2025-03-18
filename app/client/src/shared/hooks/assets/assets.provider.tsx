import React, { ReactNode, useCallback, useRef } from "react";
import { AssetsContext } from "./assets.context";
import { AssetEnum } from "shared/enums";

type AssetsProps = {
  children: ReactNode;
};

export const AssetsProvider: React.FunctionComponent<AssetsProps> = ({
  children,
}) => {
  const assetRef = useRef<Record<AssetEnum, unknown>>(
    {} as Record<AssetEnum, unknown>,
  );

  const getAsset = useCallback(
    (assetKey: AssetEnum) => assetRef.current[assetKey] as any,
    [assetRef],
  );
  const setAsset = useCallback(
    (assetKey: AssetEnum, data: unknown) => {
      assetRef.current[assetKey] = data;
    },
    [assetRef],
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
