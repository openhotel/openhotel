import {
  CollectionCategory,
  CollectionFurnitureImmutableData,
  CollectionManifest,
} from "@shared/types/collection.types.ts";

export type Collection = {
  id: string;
  accountId: string;
  latestVersion: number;
  createdAt: number;
  updatedAt: number;
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
  category: CollectionCategory;
  files: Record<string, Uint8Array>;
};

export type CollectionPublishResult =
  | { manifest: CollectionManifest; errors?: undefined }
  | { manifest?: undefined; errors: string[] };
