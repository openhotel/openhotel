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

export type CollectionManifest = {
  id: string;
  version: number;
  category: CollectionCategory;
  furniture: {
    id: string;
  }[];
};
