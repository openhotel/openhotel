import { FurnitureLang } from "./furniture.types";

export type CollectionMetadata = {
  id: string;
  category: {
    label: string;
    description?: string;
  };
  license?: string;
  minHotelVersion: string;
};

export type CollectionFurniture = {
  id: string;
  lang: FurnitureLang;
  size: number;
  file: string;
  filename?: string;
};

export type CollectionData = {
  collection: CollectionMetadata;
  furniture: CollectionFurniture[];
};
