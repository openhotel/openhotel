import { isNewVersionGreater, readYaml, writeYaml } from "@oh/utils";
import {
  type CollectionManifest,
  type FurnitureSource,
  getCollectionManifestErrors,
  getSha256,
} from "@oh/core";
import { Catalog, FurnitureData } from "shared/types/main.ts";
import { BlobReader, BlobWriter, ZipReader } from "@zip-js/data-uri";
import { parse } from "@std/yaml";
import { System } from "modules/system/main.ts";
import { log } from "shared/utils/log.utils.ts";
import { FurnitureType } from "shared/enums/furniture.enum.ts";
import { decodeTime } from "@std/ulid";
import dayjs from "dayjs";
import { isCatalogFurnitureAvailable } from "shared/utils/catalog.utils.ts";

export const furniture = () => {
  let $loadedFurnitureIds = new Set<string>();

  const $getManifestError = async (
    collection: string,
    $manifest: unknown,
  ): Promise<string | null> => {
    const manifestErrors = getCollectionManifestErrors($manifest);
    if (manifestErrors.length) {
      return manifestErrors.join(", ");
    }

    const manifest = $manifest as CollectionManifest;

    if (manifest.id !== collection) {
      return `id must be '${collection}'`;
    }

    const { version } = System.getEnvs();

    if (
      version !== "development" &&
      isNewVersionGreater(version, manifest.minHotelVersion)
    ) {
      return `requires hotel version ${manifest.minHotelVersion} or greater`;
    }

    const furnitureIds = new Set(manifest.furniture.map(({ id }) => id));

    const collectionPathname = `./assets/furniture/${collection}`;

    for await (const { name, isFile } of Deno.readDir(collectionPathname)) {
      if (!isFile || !name.endsWith(".furniture")) continue;

      if (!furnitureIds.has(name.replace(/\.furniture$/, ""))) {
        return `file '${name}' is not in the manifest`;
      }
    }

    for (const furniture of manifest.furniture) {
      let file: Uint8Array;
      try {
        file = await Deno.readFile(
          `${collectionPathname}/${furniture.id}.furniture`,
        );
      } catch (e) {
        return `file '${furniture.id}.furniture' is missing`;
      }

      if ((await getSha256(file)) !== furniture.sha256) {
        return `file '${furniture.id}.furniture' sha256 does not match`;
      }
    }

    return null;
  };

  const $getCollectionSource = async (
    collection: string,
  ): Promise<FurnitureSource | null> => {
    let manifest: unknown;
    try {
      manifest = parse(
        await Deno.readTextFile(
          `./assets/furniture/${collection}/manifest.yml`,
        ),
      );
    } catch (e) {
      if (e instanceof Deno.errors.NotFound) {
        return { source: "local" };
      }

      log(`Collection (${collection}) manifest can't be read!`);
      return null;
    }

    const manifestError = await $getManifestError(collection, manifest);
    if (manifestError) {
      log(
        `Collection (${collection}) has an invalid manifest: ${manifestError}`,
      );
      return null;
    }

    const { id, version } = manifest as CollectionManifest;

    return {
      source: "onet",
      collection: id,
      version,
    };
  };

  const unzipZipFile = async (
    dirEntry: Deno.DirEntry,
    path: string = "",
    source: FurnitureSource = { source: "local" },
  ) => {
    if (!dirEntry.isFile) {
      const collectionSource = path
        ? source
        : await $getCollectionSource(dirEntry.name);

      if (!collectionSource) return;

      for await (const childEntry of Deno.readDir(
        `./assets/furniture/${dirEntry.name}`,
      ))
        await unzipZipFile(childEntry, `${dirEntry.name}/`, collectionSource);
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
    const langFile = files.find(($file) => $file.filename === "lang.yml");

    const missingFiles = [
      !dataFile && "data.yml",
      !sheetFile && "sheet.json",
      !spriteFile && "sprite.png",
      !langFile && "lang.yml",
    ].filter(Boolean);

    if (missingFiles.length) {
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
    const langModificationDiffTime = revisionDate.diff(
      dayjs(langFile.lastModDate),
      "minutes",
    );

    //check if any file was modified
    if (
      dataModificationDiffTime !== 0 ||
      sheetModificationDiffTime !== 0 ||
      spriteModificationDiffTime !== 0 ||
      langModificationDiffTime !== 0
    )
      return log(
        `e003 Furniture (${furnitureData.id}) has an incorrect revision!`,
      );

    if (
      source.source === "onet" &&
      dirEntry.name !== `${furnitureData.id}.furniture`
    )
      return log(
        `Furniture (${furnitureData.id}) does not match its file ${dirEntry.name}!`,
      );

    await System.db.set(["furnitureSource", furnitureData.id], source);
    $loadedFurnitureIds.add(furnitureData.id);

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

    // lang
    const langBlob = await langFile.getData(new BlobWriter());
    const langUint8Array = new Uint8Array(await langBlob.arrayBuffer());

    System.db.set(
      ["furnitureData", furnitureData.id],
      [furnitureUint8Array, sheetUint8Array, spriteUint8Array, langUint8Array],
    );
    log(
      `- Furniture (${furnitureData.id}) ${foundFurniture ? "updated" : "loaded"}!`,
    );
  };

  const $removeUnloadedFurniture = async () => {
    for (const prefix of ["furnitureData", "furnitureSource"]) {
      const { items } = await System.db.list({ prefix: [prefix] });

      for (const { key } of items) {
        const furnitureId = key[1] as string;
        if ($loadedFurnitureIds.has(furnitureId)) continue;

        await System.db.delete(key);
        if (prefix === "furnitureData")
          log(`- Furniture (${furnitureId}) removed!`);
      }
    }
  };

  const load = async () => {
    log("> Loading furniture...");

    $loadedFurnitureIds = new Set();
    for await (const dirEntry of Deno.readDir("./assets/furniture"))
      await unzipZipFile(dirEntry);

    await $removeUnloadedFurniture();
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

    const catalogFurniture = await Promise.all(
      catalogCategory.furniture
        .filter(isCatalogFurnitureAvailable)
        .map(async (furniture) => {
          const data = await get(furniture.id);
          return data ? { ...furniture, type: data.type } : null;
        }),
    );
    return catalogFurniture.filter(Boolean);
  };

  const $mapFurnitureData = (furnitureData: any): FurnitureData => ({
    ...furnitureData,
    type: FurnitureType[furnitureData.type.toUpperCase()],
    actions: furnitureData.actions ?? [],
  });

  const $applyLang = (
    furnitureData: FurnitureData,
    langData: Record<string, { name: string; description: string }>,
    lang: string,
  ): FurnitureData => {
    const fallbackLang = Object.keys(langData ?? {})[0];
    const langEntry =
      langData?.[lang] ?? (fallbackLang ? langData[fallbackLang] : undefined);

    return {
      ...furnitureData,
      label: langEntry?.name ?? furnitureData.id,
      description: langEntry?.description ?? "",
    };
  };

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
    let furnitureData = $mapFurnitureData(parse(decoder.decode(data[0])));

    const { languages } = System.config.get(); // TODO: get from user preferences
    if (languages && data[3]) {
      const langData = parse(decoder.decode(data[3])) as Record<
        string,
        { name: string; description: string }
      >;
      furnitureData = $applyLang(furnitureData, langData, languages[0]);
    }

    return [furnitureData, JSON.parse(decoder.decode(data[1])), data[2]];
  };

  const getSource = async (
    furnitureId: string,
  ): Promise<FurnitureSource | null> =>
    ((await System.db.get(["furnitureSource", furnitureId])) as
      FurnitureSource | undefined) ?? null;

  return {
    load,

    getSource,

    getCatalog,
    getCatalogFurniture,
    getList,
    get,
    getData,
  };
};
