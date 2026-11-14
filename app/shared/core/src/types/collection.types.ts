export type CollectionCategory = {
  label: string;
  description?: string;
};

export type CollectionMetadata = {
  id: string;
  category: CollectionCategory;
  license?: string;
  minHotelVersion: string;
};

export type CollectionManifestFurniture = {
  id: string;
  revision: string;
  sha256: string;
};

export type CollectionManifest = {
  id: string;
  version: number;
  author: string;
  license?: string;
  minHotelVersion: string;
  formatVersion: number;
  category: CollectionCategory;
  furniture: CollectionManifestFurniture[];
  signature?: string;
};

export type CollectionFurnitureImmutableData = {
  type: string;
  size: { width: number; height: number; depth: number };
  directions: string[];
};

export type FurnitureSource =
  | { source: "local" }
  | { source: "onet"; collection: string; version: number };
