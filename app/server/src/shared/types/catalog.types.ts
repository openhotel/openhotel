export type CatalogFurniture = {
  id: string;
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
