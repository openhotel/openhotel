import { FurnitureType } from "@shared/enums/furniture.enum.ts";

export type CatalogFurniture = {
  id: string;
  price: number;
  type: FurnitureType;
};

export type CatalogCategoryData = {
  furniture: CatalogFurniture[];
};

export type CatalogCategory = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  range?: {
    from?: string;
    to?: string;
  };
  furniture: CatalogFurniture[];
};

export type Catalog = {
  categories: CatalogCategory[];
};
