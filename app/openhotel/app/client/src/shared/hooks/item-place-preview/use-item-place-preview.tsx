import { useContext } from "react";
import {
  ItemPlacePreviewContext,
  ItemPreviewState,
} from "./item-place-preview.context";

export const useItemPlacePreview = (): ItemPreviewState =>
  useContext(ItemPlacePreviewContext);
