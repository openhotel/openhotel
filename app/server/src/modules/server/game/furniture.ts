import { parse, stringify } from "deno/yaml/mod.ts";
import { Catalog, FurnitureData } from "shared/types/main.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";
import { decompress } from "zip";

export const furniture = () => {
  let $catalog: Catalog;
  const $furnitureMap: Record<string, FurnitureData> = {};

  const load = async () => {
    for await (const dirEntry of Deno.readDir("./assets/furniture")) {
      if (!dirEntry.isFile || !dirEntry.name.includes(".zip")) continue;

      const destName = `./assets/furniture/.data/${dirEntry.name}`.replace(
        ".zip",
        "",
      );

      try {
        await Deno.stat(destName);
      } catch (e) {
        decompress(`./assets/furniture/${dirEntry.name}`, destName);
      }

      const furnitureData = parse(
        await Deno.readTextFile(`${destName}/data.yml`),
      );

      if ($furnitureMap[furnitureData.id])
        throw Error(`Furniture with id ${furnitureData.id} already exists!`);

      $furnitureMap[furnitureData.id] = {
        ...furnitureData,
        type: FurnitureType[
          furnitureData.type.toUpperCase() ?? "FURNITURE"
        ] as unknown as FurnitureType,
      };
    }

    await Deno.writeTextFile(
      "./assets/furniture/.data/furniture.yml",
      stringify(Object.keys($furnitureMap)),
    );

    $catalog = parse(await Deno.readTextFile("./assets/catalog.yml"));
  };

  const getCatalog = (): Catalog => $catalog;

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
