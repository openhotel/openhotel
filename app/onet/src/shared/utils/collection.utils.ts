import { BlobReader, ZipReader } from "@zip-js";
import { parse } from "@std/yaml";
import { decodeTime } from "@std/ulid";
import {
  COLLECTION_FURNITURE_DIRECTIONS,
  COLLECTION_FURNITURE_MAX_SIZE,
  COLLECTION_FURNITURE_MAX_UNCOMPRESSED_SIZE,
  COLLECTION_FURNITURE_FILES,
  COLLECTION_FURNITURE_TYPES,
  COLLECTION_ID_REGEX,
  COLLECTION_LANG_CODE_REGEX,
  COLLECTION_LANG_DESCRIPTION_MAX_LENGTH,
  COLLECTION_LANG_NAME_MAX_LENGTH,
} from "shared/consts/main.ts";
import {
  CollectionFurniture,
  CollectionFurnitureImmutableData,
} from "shared/types/main.ts";

export const getSha256 = async (data: Uint8Array): Promise<string> =>
  Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", data as BufferSource)),
  )
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

export const getStableJson = (value: unknown): string => {
  if (Array.isArray(value))
    return `[${value.map((item) => getStableJson(item ?? null)).join(",")}]`;

  if (value && typeof value === "object") {
    return `{${Object.keys(value)
      .filter((key) => value[key] !== undefined)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${getStableJson(value[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
};

export const isValidHotelVersion = (version: string): boolean =>
  typeof version === "string" &&
  /^v?\d+\.\d+\.\d+(-[a-z]+(\.\d+)?)?$/.test(version);

const isObject = (value: unknown): value is Record<string, any> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isInteger = (value: unknown, min = -Infinity): value is number =>
  Number.isInteger(value) && value >= min;

const isText = (value: unknown, maxLength: number): value is string =>
  typeof value === "string" && value.length > 0 && value.length <= maxLength;

const checkKeys = (
  errors: string[],
  path: string,
  value: unknown,
  required: string[],
  optional: string[] = [],
): value is Record<string, any> => {
  if (!isObject(value)) {
    errors.push(`${path} must be an object`);
    return false;
  }

  const allowed = [...required, ...optional];
  const length = errors.length;

  for (const key of required) {
    if (value[key] === undefined) {
      errors.push(`${path}.${key} is required`);
    }
  }

  for (const key of Object.keys(value)) {
    if (!allowed.includes(key)) {
      errors.push(`${path}.${key} is not allowed`);
    }
  }

  return errors.length === length;
};

const checkIntegers = (
  errors: string[],
  path: string,
  value: Record<string, any>,
  keys: string[],
  min = -Infinity,
) => {
  for (const key of keys) {
    if (key in value && !isInteger(value[key], min)) {
      errors.push(`${path}.${key} must be an integer >= ${min}`);
    }
  }
};

const checkDataFile = (
  errors: string[],
  furnitureId: string,
  data: unknown,
  frames: string[],
): CollectionFurnitureImmutableData | null => {
  const path = "data.yml";

  const hasValidDataKeys = checkKeys(
    errors,
    path,
    data,
    ["id", "type", "revision", "icon", "size", "direction"],
    ["actions"],
  );

  if (!hasValidDataKeys) {
    return null;
  }

  const length = errors.length;

  if (data.id !== furnitureId) {
    errors.push(`${path}.id must be '${furnitureId}'`);
  }

  if (!COLLECTION_FURNITURE_TYPES.includes(data.type)) {
    errors.push(
      `${path}.type must be one of ${COLLECTION_FURNITURE_TYPES.join(", ")}`,
    );
  }

  const checkTexture = ($path: string, texture: string) => {
    if (typeof texture !== "string" || !frames.includes(texture)) {
      errors.push(`${$path} '${texture}' is not a frame of sheet.json`);
    }
  };

  const checkBounds = ($path: string, bounds: unknown) => {
    const hasValidBoundsKeys = checkKeys(errors, $path, bounds, [
      "width",
      "height",
    ]);

    if (hasValidBoundsKeys) {
      checkIntegers(errors, $path, bounds, ["width", "height"], 0);
    }
  };

  const hasValidIconKeys = checkKeys(
    errors,
    `${path}.icon`,
    data.icon,
    ["texture"],
    ["bounds"],
  );

  if (hasValidIconKeys) {
    checkTexture(`${path}.icon.texture`, data.icon.texture);

    if ("bounds" in data.icon) {
      checkBounds(`${path}.icon.bounds`, data.icon.bounds);
    }
  }

  const hasValidSizeKeys = checkKeys(errors, `${path}.size`, data.size, [
    "width",
    "height",
    "depth",
  ]);

  if (hasValidSizeKeys) {
    checkIntegers(errors, `${path}.size`, data.size, Object.keys(data.size), 0);
  }

  // directions
  const directions: string[] = [];

  const hasValidDirectionKeys = checkKeys(
    errors,
    `${path}.direction`,
    data.direction,
    [],
    [...COLLECTION_FURNITURE_DIRECTIONS],
  );

  if (hasValidDirectionKeys) {
    for (const [direction, directionData] of Object.entries(data.direction)) {
      const $path = `${path}.direction.${direction}`;
      directions.push(direction);

      if (!checkKeys(errors, $path, directionData, ["textures"])) continue;
      if (!Array.isArray(directionData.textures)) {
        errors.push(`${$path}.textures must be a list`);
        continue;
      }

      directionData.textures.forEach((texture: unknown, index: number) => {
        const $$path = `${$path}.textures[${index}]`;
        if (
          !checkKeys(
            errors,
            $$path,
            texture,
            ["texture"],
            ["pivot", "position", "zIndex", "bounds", "actions"],
          )
        )
          return;

        checkTexture(`${$$path}.texture`, texture.texture);
        checkIntegers(errors, $$path, texture, ["zIndex"]);

        if ("bounds" in texture) {
          checkBounds(`${$$path}.bounds`, texture.bounds);
        }

        if (
          "pivot" in texture &&
          checkKeys(errors, `${$$path}.pivot`, texture.pivot, ["x", "y"])
        ) {
          checkIntegers(errors, `${$$path}.pivot`, texture.pivot, ["x", "y"]);
        }

        if (
          "position" in texture &&
          checkKeys(errors, `${$$path}.position`, texture.position, ["x", "z"])
        ) {
          checkIntegers(errors, `${$$path}.position`, texture.position, [
            "x",
            "z",
          ]);
        }
      });
    }
  }

  if (errors.length !== length) return null;

  return {
    type: data.type,
    size: {
      width: data.size.width,
      height: data.size.height,
      depth: data.size.depth,
    },
    directions: directions.sort(),
    // actions: [], // TODO: implement actions validation
  };
};

const checkSheetFile = (errors: string[], sheet: unknown): string[] => {
  const path = "sheet.json";

  const hasValidSheetKeys = checkKeys(
    errors,
    path,
    sheet,
    ["frames", "meta"],
    ["animations"],
  );

  if (!hasValidSheetKeys) {
    return [];
  }

  const hasValidMetaKeys = checkKeys(
    errors,
    `${path}.meta`,
    sheet.meta,
    ["image", "size"],
    ["format", "scale"],
  );

  if (hasValidMetaKeys && sheet.meta.image !== "sprite.png") {
    errors.push(`${path}.meta.image must be 'sprite.png'`);
  }

  if ("animations" in sheet && !isObject(sheet.animations)) {
    errors.push(`${path}.animations must be an object`);
  }

  if (!isObject(sheet.frames)) {
    errors.push(`${path}.frames must be an object`);
    return [];
  }

  for (const [name, frame] of Object.entries(sheet.frames)) {
    const $path = `${path}.frames.${name}`;

    const hasValidFrameKeys = checkKeys(
      errors,
      $path,
      frame,
      ["frame"],
      [
        "sourceSize",
        "spriteSourceSize",
        "anchor",
        "rotated",
        "trimmed",
        "__key",
      ],
    );

    if (!hasValidFrameKeys) continue;

    const hasValidRectKeys = checkKeys(errors, `${$path}.frame`, frame.frame, [
      "x",
      "y",
      "w",
      "h",
    ]);
    if (!hasValidRectKeys) continue;

    const { x, y, w, h } = frame.frame;
    if (![x, y, w, h].every((value) => isInteger(value, 0))) {
      errors.push(`${$path}.frame must be integers >= 0`);
    }
  }

  return Object.keys(sheet.frames);
};

const checkLangFile = (errors: string[], lang: unknown) => {
  const path = "lang.yml";

  if (!isObject(lang) || !Object.keys(lang).length) {
    return errors.push(`${path} must have at least one language`);
  }

  for (const [code, item] of Object.entries(lang)) {
    const $path = `${path}.${code}`;

    if (!COLLECTION_LANG_CODE_REGEX.test(code)) {
      errors.push(`${$path} is not a valid language code`);
    }

    const hasValidLangKeys = checkKeys(errors, $path, item, [
      "name",
      "description",
    ]);
    if (!hasValidLangKeys) continue;

    if (!isText(item.name, COLLECTION_LANG_NAME_MAX_LENGTH)) {
      errors.push(`${$path}.name is not valid`);
    }

    if (
      typeof item.description !== "string" ||
      item.description.length > COLLECTION_LANG_DESCRIPTION_MAX_LENGTH
    ) {
      errors.push(`${$path}.description is not valid`);
    }
  }
};

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

  const [prefix, name, ...rest] = furnitureId.split("@");

  if (
    prefix !== collectionId ||
    rest.length ||
    !COLLECTION_ID_REGEX.test(name)
  ) {
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

  checkLangFile(errors, lang);

  const frames = checkSheetFile(errors, sheet);
  const immutableData = checkDataFile(errors, furnitureId, data, frames);

  if (!immutableData) return fail();

  let revisionTime: number | null = null;
  try {
    revisionTime = decodeTime(data.revision);
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
      revision: data.revision,
      sha256: await getSha256(file),
      immutableData,
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
