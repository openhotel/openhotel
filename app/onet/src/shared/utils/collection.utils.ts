import { BlobReader, ZipReader } from "@zip-js";
import { parse } from "@std/yaml";
import { decodeTime } from "@std/ulid";
import {
  COLLECTION_FURNITURE_FILES,
  COLLECTION_FURNITURE_MAX_SIZE,
  COLLECTION_FURNITURE_MAX_UNCOMPRESSED_SIZE,
  type FurnitureDataFile,
  getFurnitureFilesErrors,
  getFurnitureImmutableData,
  getSha256,
  getStableJson,
  isValidCollectionFurnitureId,
} from "@oh/core";
import { CollectionFurniture } from "shared/types/main.ts";

const $readEntries = async (
  file: Uint8Array,
): Promise<{
  files: Record<string, Uint8Array>;
  dates: Record<string, Date>;
}> => {
  const entries = await new ZipReader(
    new BlobReader(new Blob([file as BlobPart])),
  ).getEntries();

  const files: Record<string, Uint8Array> = {};
  const dates: Record<string, Date> = {};
  let total = 0;

  for (const entry of entries) {
    if (entry.directory) {
      throw new Error(`'${entry.filename}' is a directory`);
    }

    if (entry.filename in files) {
      throw new Error(`'${entry.filename}' is duplicated`);
    }

    const chunks: Uint8Array[] = [];
    await entry.getData(
      new WritableStream<Uint8Array>({
        write: (chunk) => {
          total += chunk.length;

          if (total > COLLECTION_FURNITURE_MAX_UNCOMPRESSED_SIZE) {
            throw new Error("uncompressed size is too big");
          }

          chunks.push(chunk);
        },
      }),
    );

    const data = new Uint8Array(
      chunks.reduce((size, chunk) => size + chunk.length, 0),
    );

    let offset = 0;
    for (const chunk of chunks) {
      data.set(chunk, offset);
      offset += chunk.length;
    }

    files[entry.filename] = data;
    dates[entry.filename] = entry.lastModDate;
  }

  return { files, dates };
};

export const getCollectionFurniture = async (
  collectionId: string,
  furnitureId: string,
  file: Uint8Array,
): Promise<{ furniture?: CollectionFurniture; errors: string[] }> => {
  const errors = [];

  const fail = () => ({
    errors: errors.map((error) => `${furnitureId}: ${error}`),
  });

  if (!isValidCollectionFurnitureId(collectionId, furnitureId)) {
    errors.push(`id must be '${collectionId}@<name>'`);
  }

  if (file.length > COLLECTION_FURNITURE_MAX_SIZE) {
    errors.push(`file is bigger than ${COLLECTION_FURNITURE_MAX_SIZE} bytes`);
  }

  if (errors.length) {
    return fail();
  }

  let files: Record<string, Uint8Array>;
  let dates: Record<string, Date>;
  try {
    const entries = await $readEntries(file);
    files = entries.files;
    dates = entries.dates;
  } catch (e) {
    errors.push(`invalid zip: ${e.message}`);
    return fail();
  }

  for (const filename of COLLECTION_FURNITURE_FILES) {
    if (!files[filename]) {
      errors.push(`${filename} is missing`);
    }
  }

  for (const filename of Object.keys(files)) {
    if (!COLLECTION_FURNITURE_FILES.includes(filename)) {
      errors.push(`${filename} is not allowed`);
    }
  }

  if (errors.length) return fail();

  const decoder = new TextDecoder();
  const parseFile = (filename: string, parser: (text: string) => unknown) => {
    try {
      return parser(decoder.decode(files[filename]));
    } catch (e) {
      errors.push(`${filename} can't be parsed`);
      return undefined;
    }
  };

  const sheet = parseFile("sheet.json", JSON.parse);
  const data = parseFile("data.yml", parse);
  const lang = parseFile("lang.yml", parse);

  if (errors.length) return fail();

  errors.push(...getFurnitureFilesErrors(furnitureId, { data, sheet, lang }));

  if (errors.length) return fail();

  const furnitureData = data as FurnitureDataFile;

  let revisionTime: number | null = null;
  try {
    revisionTime = decodeTime(furnitureData.revision);
  } catch {
    errors.push("data.yml.revision is not a valid ulid");
  }

  if (revisionTime !== null) {
    for (const filename of COLLECTION_FURNITURE_FILES) {
      if (
        Math.trunc((revisionTime - dates[filename].getTime()) / 60_000) !== 0
      ) {
        errors.push(`${filename} modification date does not match revision`);
      }
    }
  }

  if (errors.length) return fail();

  return {
    furniture: {
      id: furnitureId,
      revision: furnitureData.revision,
      sha256: await getSha256(file),
      immutableData: getFurnitureImmutableData(furnitureData),
    },
    errors: [],
  };
};

export const getVersionErrors = (
  previous: CollectionFurniture[],
  next: CollectionFurniture[],
): string[] => {
  const errors: string[] = [];

  for (const $previous of previous) {
    const $next = next.find(({ id }) => id === $previous.id);
    if (!$next) {
      errors.push(`${$previous.id}: published furniture can't be removed`);
      continue;
    }

    if (
      getStableJson($previous.immutableData) !==
      getStableJson($next.immutableData)
    ) {
      errors.push(
        `${$previous.id}: type, size and directions can't change, use a new id`,
      );
    }

    if (
      $previous.sha256 !== $next.sha256 &&
      decodeTime($next.revision) <= decodeTime($previous.revision)
    ) {
      errors.push(`${$previous.id}: changed furniture needs a newer revision`);
    }
  }

  return errors;
};
