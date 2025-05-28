import React from "react";
import { FurnitureData } from "shared/types";

export type ItemPreviewData = {
  ids: string[];
  furnitureData: FurnitureData;
};

export type TemplateState = {
  setItemPreviewData: (data: ItemPreviewData) => void;
  itemPreviewData: ItemPreviewData | null;
  clearItemPreviewData: () => void;

  renderPreviewItem: React.ReactNode;
  getPreviewItemId: () => string;

  canPlace: () => boolean;
  setCanPlace: (canPlace: boolean) => void;
};

export const ItemPlacePreviewContext =
  React.createContext<TemplateState>(undefined);
