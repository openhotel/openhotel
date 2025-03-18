import { useContext } from "react";
import { AssetsContext, AssetsState } from "shared/hooks/assets/assets.context";

export const useAssets = (): AssetsState => useContext(AssetsContext);
