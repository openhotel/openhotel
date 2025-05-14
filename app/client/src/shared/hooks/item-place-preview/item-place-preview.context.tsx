import React from "react";
import { FurnitureData } from "shared/types";

export type TemplateState = {
  setItemPreviewData: (data: {
    id: string;
    furnitureData: FurnitureData;
  }) => void;
  clearItemPreviewData: () => void;

  renderPreviewItem: React.ReactNode;

  canPlace: () => boolean;
  setCanPlace: (canPlace: boolean) => void;
};

export const ItemPlacePreviewContext =
  React.createContext<TemplateState>(undefined);
