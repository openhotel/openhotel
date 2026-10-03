import type { CollectionMetadata, FurnitureLang } from "@oh/core";

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
