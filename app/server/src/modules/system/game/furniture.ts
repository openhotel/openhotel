import { readYaml, writeYaml, createDirectoryIfNotExists } from "@oh/utils";
import { Catalog, FurnitureData } from "shared/types/main.ts";
import { BlobReader, ZipReader, Uint8ArrayWriter } from "@zip-js";
import { FurnitureType } from "shared/enums/furniture.enum.ts";

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

        const file = await Deno.readFile(`./assets/furniture/${dirEntry.name}`);

        // Initialize a zip reader
        const blob = new Blob([file]);
        const blobReader = new BlobReader(blob);
        const zipReader = new ZipReader(blobReader);

        for (const file of await zipReader.getEntries()) {
          const content = await file.getData(new Uint8ArrayWriter());
          const fileDir = destName + "/" + file.filename;
          await createDirectoryIfNotExists(fileDir);

          await Deno.writeFile(fileDir, content);
        }
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
    const catalogDir = "./assets/catalog.yml";
    try {
      $catalog = await readYaml(catalogDir);
    } catch (e) {
      $catalog = {
        categories: [],
      };
      await writeYaml(catalogDir, $catalog);
    }
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
