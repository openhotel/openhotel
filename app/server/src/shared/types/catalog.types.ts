export type CatalogFurniture = {
  id: string;
  price: number;
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
