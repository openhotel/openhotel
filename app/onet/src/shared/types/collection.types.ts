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
