import React from "react";
import { FurnitureData } from "shared/types";

export type TemplateState = {
  setItemPreviewData: (data: {
    ids: string[];
    furnitureData: FurnitureData;
  }) => void;
  clearItemPreviewData: () => void;

  renderPreviewItem: React.ReactNode;
  getPreviewItemId: () => string;

  canPlace: () => boolean;
  setCanPlace: (canPlace: boolean) => void;
};

export const ItemPlacePreviewContext =
  React.createContext<TemplateState>(undefined);
