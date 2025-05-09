import { readYaml, writeYaml } from "@oh/utils";
import { Catalog, FurnitureData } from "shared/types/main.ts";
import { BlobReader, BlobWriter, ZipReader } from "@zip-js/data-uri";
import { parse } from "@std/yaml";
import { System } from "modules/system/main.ts";
import { log } from "shared/utils/log.utils.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";
import { decodeTime } from "@std/ulid";
import dayjs from "dayjs";

export const furniture = () => {
  const unzipZipFile = async (dirEntry: Deno.DirEntry, path: string = "") => {
    if (!dirEntry.isFile) {
      for await (const childEntry of Deno.readDir(
        `./assets/furniture/${dirEntry.name}`,
      ))
        await unzipZipFile(childEntry, `${dirEntry.name}/`);
    }
    if (!dirEntry.name.includes(".furniture")) return;

    const furniturePathname = `./assets/furniture/${path + dirEntry.name}`;

    const file = await Deno.readFile(furniturePathname);

    const blob = new Blob([file]);
    const blobReader = new BlobReader(blob);
    const zipReader = new ZipReader(blobReader);

    const files = await zipReader.getEntries();

    const dataFile = files.find(($file) => $file.filename === "data.yml");
    const sheetFile = files.find(($file) => $file.filename === "sheet.json");
    const spriteFile = files.find(($file) => $file.filename === "sprite.png");
    // const langFile = files.find($file => $file.filename === 'lang.yml');

    const missingFiles = [
      dataFile ? "data.yml" : null,
      sheetFile ? "sheet.json" : null,
      spriteFile ? "sprite.png" : null,
    ].filter(Boolean);

    if (!missingFiles.length) {
      log(
        `Furniture ${dirEntry.name} is missing (${missingFiles.join(",")}) files!`,
      );
      return;
    }

    // data
    const furnitureBlob = await dataFile.getData(new BlobWriter());
    const furnitureUint8Array = new Uint8Array(
      await furnitureBlob.arrayBuffer(),
    );
    const furnitureData = await parse(await furnitureBlob.text());

    if (!furnitureData.revision)
      return log(
        `e001 Furniture (${furnitureData.id}) has an incorrect revision!`,
      );

    let revisionTime;
    try {
      revisionTime = decodeTime(furnitureData.revision);
    } catch (e) {
      return log(
        `e002 Furniture (${furnitureData.id}) has an incorrect revision!`,
      );
    }
    const revisionDate = dayjs(revisionTime);

    const dataModificationDiffTime = revisionDate.diff(
      dayjs(dataFile.lastModDate),
      "minutes",
    );
    const sheetModificationDiffTime = revisionDate.diff(
      dayjs(sheetFile.lastModDate),
      "minutes",
    );
    const spriteModificationDiffTime = revisionDate.diff(
      dayjs(spriteFile.lastModDate),
      "minutes",
    );

    //check if any file was modified
    if (
      dataModificationDiffTime !== 0 ||
      sheetModificationDiffTime !== 0 ||
      spriteModificationDiffTime !== 0
    )
      return log(
        `e003 Furniture (${furnitureData.id}) has an incorrect revision!`,
      );

    const foundFurniture = await get(furnitureData.id);

    if (foundFurniture?.revision) {
      const currentRevisionDate = dayjs(decodeTime(foundFurniture.revision));
      const revisionDiffTime = currentRevisionDate.diff(
        revisionDate,
        "minutes",
      );
      //file is the same
      if (
        revisionDiffTime === 0 &&
        foundFurniture.revision === furnitureData.revision
      )
        return;
    }

    // sheet
    const sheetBlob = await sheetFile.getData(new BlobWriter());
    const sheetUint8Array = new Uint8Array(await sheetBlob.arrayBuffer());

    // sprite
    const spriteBlob = await spriteFile.getData(new BlobWriter());
    const spriteUint8Array = new Uint8Array(await spriteBlob.arrayBuffer());

    System.db.set(
      ["furnitureData", furnitureData.id],
      [furnitureUint8Array, sheetUint8Array, spriteUint8Array],
    );
    log(
      `- Furniture (${furnitureData.id}) ${foundFurniture ? "updated" : "loaded"}!`,
    );
  };

  const load = async () => {
    log("> Loading furniture...");

    for await (const dirEntry of Deno.readDir("./assets/furniture"))
      await unzipZipFile(dirEntry);
    log("> Furniture loaded!");
  };

  const getCatalog = async (): Promise<Catalog> => {
    const catalogDir = "./assets/catalog.yml";
    let $catalog = {
      categories: [],
    };
    try {
      $catalog = await readYaml(catalogDir);
    } catch (e) {
      await writeYaml(catalogDir, $catalog);
    }
    return $catalog;
  };

  const getCatalogFurniture = async (category: string) => {
    const catalog = await getCatalog();
    const catalogCategory = catalog.categories.find(
      ($category) => $category.id === category && $category.enabled,
    );
    if (!catalogCategory) return [];

    return await Promise.all(
      catalogCategory.furniture.map(async (furniture) => {
        const data = await get(furniture.id);
        return {
          ...furniture,
          type: data.type,
        };
      }),
    );
  };

  const $mapFurnitureData = (furnitureData: any): FurnitureData => ({
    ...furnitureData,
    type: FurnitureType[furnitureData.type.toUpperCase()],
  });

  const getList = async (): Promise<FurnitureData[]> => {
    const decoder = new TextDecoder();
    const { items } = await System.db.list({ prefix: ["furnitureData"] });
    return items.map(({ value: [data] }) =>
      $mapFurnitureData(parse(decoder.decode(data))),
    );
  };
  const get = async (furnitureId: string): Promise<FurnitureData | null> => {
    const decoder = new TextDecoder();
    const data = await System.db.get(["furnitureData", furnitureId]);
    if (!data) return null;

    return $mapFurnitureData(parse(decoder.decode(data[0])));
  };
  const getData = async (
    furnitureId: string,
  ): Promise<[FurnitureData, any, string] | null> => {
    if (!furnitureId) return null;
    const data = await System.db.get(["furnitureData", furnitureId]);
    if (!data) return null;

    const decoder = new TextDecoder();
    return [
      $mapFurnitureData(parse(decoder.decode(data[0]))),
      JSON.parse(decoder.decode(data[1])),
      data[2],
    ];
  };

  return {
    load,

    getCatalog,
    getCatalogFurniture,
    getList,
    get,
    getData,
  };
};
