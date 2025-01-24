import { CatalogCategory } from "shared/enums";

type Params = {
  sprite: string;
  label: string;
};

export const CATALOG_CATEGORY_PARAMS_MAP: Record<CatalogCategory, Params> = {
  [CatalogCategory.ALPHA]: {
    sprite: "icon-alpha",
    label: "alpha",
  },
  [CatalogCategory.FLAGS]: {
    sprite: "icon-flags",
    label: "flags",
  },
  [CatalogCategory.TOYS]: {
    sprite: "icon-toys",
    label: "toys",
  },
  [CatalogCategory.TELEPORTS]: {
    sprite: "icon-teleports",
    label: "teleports",
  },
  [CatalogCategory.XMAS]: {
    sprite: "icon-xmas",
    label: "xmas",
  },
};
