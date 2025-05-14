import { useContext } from "react";
import {
  ItemPlacePreviewContext,
  TemplateState,
} from "./item-place-preview.context";

export const useItemPlacePreview = (): TemplateState =>
  useContext(ItemPlacePreviewContext);
