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
  category: {
    label: string;
    description?: string;
  };
  furniture: CollectionManifestFurniture[];
  signature?: string;
};

export type Collection = {
  id: string;
  accountId: string;
  latestVersion: number;
  createdAt: number;
  updatedAt: number;
};

export type CollectionFurnitureImmutableData = {
  type: string;
  size: { width: number; height: number; depth: number };
  directions: string[];
};

export type CollectionFurniture = {
  id: string;
  revision: string;
  sha256: string;
  immutableData: CollectionFurnitureImmutableData;
};

export type CollectionPublishProps = {
  id: string;
  accountId: string;
  license?: string;
  minHotelVersion: string;
  category: {
    label: string;
    description?: string;
  };
  files: Record<string, Uint8Array>;
};

export type CollectionPublishResult =
  | { manifest: CollectionManifest; errors?: undefined }
  | { manifest?: undefined; errors: string[] };
