import { FurnitureType } from "shared/enums";

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
};

export type Catalog = {
  categories: CatalogCategory[];
};
