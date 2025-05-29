import React from "react";
import { FurnitureData, PrivateRoom } from "shared/types";

export type ItemPreviewData = {
  ids: string[];
  furnitureData: FurnitureData;
  type: "place" | "move";
};

export type TemplateState = {
  setItemPreviewData: (data: ItemPreviewData) => void;
  itemPreviewData: ItemPreviewData | null;
  clearItemPreviewData: () => void;

  renderPreviewItem: React.ReactNode;
  getPreviewItemId: () => string;

  canPlace: () => boolean;
  setCanPlace: (canPlace: boolean) => void;

  setPrivateRoom: (room?: PrivateRoom) => void;
};

export const ItemPlacePreviewContext =
  React.createContext<TemplateState>(undefined);
