import { parse } from "deno/yaml/mod.ts";
import { Catalog, FurnitureData } from "shared/types/main.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";

export const furniture = () => {
  // const furnitureList: FurnitureData[] = [];
  let $catalog: Catalog;
  const $furnitureMap: Record<string, FurnitureData> = {};

  const load = async () => {
    const furnitureData = parse(
      await Deno.readTextFile("./assets/furniture/furniture.yml"),
    );

    for (const fullFurnitureId of furnitureData.furniture) {
      const [collectionId, furnitureId] = fullFurnitureId.split("/");

      const furnitureData = parse(
        await Deno.readTextFile(
          `./assets/furniture/${collectionId}/${furnitureId}.yml`,
        ),
      );

      $furnitureMap[fullFurnitureId] = {
        ...furnitureData,
        id: fullFurnitureId,
        collectionId,
        type: FurnitureType[
          furnitureData.type.toUpperCase() ?? "FURNITURE"
        ] as unknown as FurnitureType,
      };
    }

    $catalog = parse(await Deno.readTextFile("./assets/catalog.yml"));
  };

  const getCatalog = (): Catalog => catalogData;

  const getList = (): FurnitureData[] => Object.values($furnitureMap);
  const get = (furnitureId: string): FurnitureData | null =>
    $furnitureMap[furnitureId];

  return {
    load,

    getCatalog,
    getList,
    get,
  };
};
