import { FurnitureLang } from "@shared/types/furniture.types.ts";
import { CollectionMetadata } from "@shared/types/collection.types.ts";

//@ignore-duplicate
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
