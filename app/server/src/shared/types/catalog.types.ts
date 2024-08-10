import { FurnitureData } from "./furniture.types.ts";

export type CatalogFurniture = {
  furniture: FurnitureData;
  price: number;
};

export type CatalogCategory = {
  id: string;
  label: string;
  enabled: boolean;
  furniture: CatalogFurniture[];
};

export type Catalog = {
  categories: CatalogCategory[];
};
