import dayjs from "dayjs";
import { CatalogCategory } from "../types/catalog.types.ts";

export const isCatalogCategoryAvailable = (catalog: CatalogCategory) => {
  const from = catalog?.range?.from;
  const to = catalog?.range?.to;

  return (
    catalog.enabled &&
    (!from || dayjs(dayjs()).diff(from, "minutes") >= 0) &&
    (!to || dayjs(to).diff(dayjs(), "minutes") > 0)
  );
};
