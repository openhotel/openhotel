import { create } from "zustand";
import { AssetEnum } from "shared/enums";

export const useAssetsStore = create<{
  assets: Record<AssetEnum, unknown>;
  setAsset: (assetKey: AssetEnum, asset: unknown) => void;
  getAsset: (assetKey: AssetEnum) => unknown;
}>((set, get) => ({
  assets: {} as Record<AssetEnum, unknown>,
  setAsset: (assetKey: AssetEnum, asset: unknown) =>
    set((state) => ({
      ...state,
      assets: {
        ...state.assets,
        [assetKey]: asset,
      },
    })),
  getAsset: (asset: AssetEnum) => get().assets[asset],
}));
