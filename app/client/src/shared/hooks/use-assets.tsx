import React, { ReactNode, useCallback, useContext, useRef } from "react";
import { AssetEnum } from "shared/enums";

type AssetsState = {
  getAsset: <Data>(assetKey: AssetEnum) => Data;
  setAsset: (assetKey: AssetEnum, data: unknown) => void;
};

const AssetsContext = React.createContext<AssetsState>(undefined);

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

export const useAssets = (): AssetsState => useContext(AssetsContext);
