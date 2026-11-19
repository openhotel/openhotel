export type CollectionCategory = {
  label: string;
  description?: string;
};

export type Collection = {
  id: string;
  category: CollectionCategory | null;
  latestVersion: number;
  furnitureCount: number;
  createdAt: number;
  updatedAt: number;
};

export type CollectionPublishProps = {
  id: string;
  accountId: string;
  license?: string;
  minHotelVersion: string;
  category: CollectionCategory;
  files: Record<string, Uint8Array>;
};

export type CollectionPublishResult =
  | { manifest: CollectionManifest; errors?: undefined }
  | { manifest?: undefined; errors: string[] };

//@ignore-duplicate
export type CollectionFurniture = {
  id: string;
  revision: string;
  sha256: string;
  immutableData: CollectionFurnitureImmutableData;
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
  { source: "local" } | { source: "onet"; collection: string; version: number };
