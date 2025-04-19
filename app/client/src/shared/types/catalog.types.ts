export type CatalogFurniture = {
  id: string;
  price: number;
};

export type CatalogCategoryData = {
  furniture: CatalogFurniture[];
};

export type CatalogCategory = {
  id: string;
  label: string;
};

export type Catalog = {
  categories: CatalogCategory[];
};
