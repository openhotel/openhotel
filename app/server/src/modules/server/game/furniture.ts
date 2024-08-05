import { parse } from "deno/yaml/mod.ts";
import { FurnitureData, Catalog } from "shared/types/main.ts";

export const furniture = () => {
  const furnitureList: FurnitureData[] = [];
  const catalogData: Catalog = {
    categories: [],
  };

  const load = async () => {
    const furnitureData = parse(
      await Deno.readTextFile("./assets/furniture/furniture.yml"),
    );

    for (const furnitureId of furnitureData.furniture) {
      const furniData = parse(
        await Deno.readTextFile(`./assets/furniture/${furnitureId}.yml`),
      ) as FurnitureData;
      furnitureList.push({
        ...furniData,
        id: furnitureId,
      });
    }

    const catalog = parse(
      await Deno.readTextFile("./assets/furniture/catalog.yml"),
    );
    for (const category of catalog.categories) {
      const categoryData = parse(
        await Deno.readTextFile(
          `./assets/furniture/${category.id}/${category.id}.yml`,
        ),
      );
      catalogData.categories.push({
        id: category.id,
        enabled: category.enabled,
        furniture: categoryData.furniture.map(({ id, price }) => ({
          furniture: get(id),
          price,
        })),
      });
    }
  };

  const getCatalog = (): Catalog => catalogData;

  const getList = (): FurnitureData[] => furnitureList;
  const get = (furnitureId: string): FurnitureData | null =>
    furnitureList.find(($furniture) => $furniture.id === furnitureId);

  return {
    load,

    getCatalog,
    getList,
    get,
  };
};
