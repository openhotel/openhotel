import { readYaml, writeYaml } from "@oh/yaml";
import { Catalog, FurnitureData } from "shared/types/main.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";
import { decompress } from "zip";
import { createDirectoryIfNotExists } from "shared/utils/main.ts";

export const furniture = () => {
  let $catalog: Catalog;
  const $furnitureMap: Record<string, FurnitureData> = {};

  const load = async () => {
    await createDirectoryIfNotExists("./assets/furniture/.data/");

    for await (const dirEntry of Deno.readDir("./assets/furniture")) {
      if (!dirEntry.isFile || !dirEntry.name.includes(".zip")) continue;

      const destName = `./assets/furniture/.data/${dirEntry.name}`.replace(
        ".zip",
        "",
      );

      try {
        await Deno.stat(destName);
      } catch (e) {
        await createDirectoryIfNotExists(destName);
        await decompress(`./assets/furniture/${dirEntry.name}`, destName);
      }

      const furnitureData = await readYaml(`${destName}/data.yml`);

      if ($furnitureMap[furnitureData.id])
        throw Error(`Furniture with id ${furnitureData.id} already exists!`);

      $furnitureMap[furnitureData.id] = {
        ...furnitureData,
        type: FurnitureType[
          furnitureData.type.toUpperCase() ?? "FURNITURE"
        ] as unknown as FurnitureType,
      };
    }

    await writeYaml(
      "./assets/furniture/.data/furniture.yml",
      Object.keys($furnitureMap),
    );
    $catalog = await readYaml("./assets/catalog.yml");
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
