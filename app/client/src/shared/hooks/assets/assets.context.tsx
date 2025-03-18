import React from "react";
import { AssetEnum } from "shared/enums";

export type AssetsState = {
  getAsset: <Data>(assetKey: AssetEnum) => Data;
  setAsset: (assetKey: AssetEnum, data: unknown) => void;
};

export const AssetsContext = React.createContext<AssetsState>(undefined);
