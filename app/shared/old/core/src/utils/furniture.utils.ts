import {
  COLLECTION_FURNITURE_DIRECTIONS,
  COLLECTION_FURNITURE_TYPES,
  COLLECTION_LANG_CODE_REGEX,
  COLLECTION_LANG_DESCRIPTION_MAX_LENGTH,
  COLLECTION_LANG_NAME_MAX_LENGTH,
} from "../consts/collection.consts.ts";
import type {
  CollectionFurnitureImmutableData,
  FurnitureDataFile,
} from "../types/main.ts";
import {
  checkIntegers,
  checkKeys,
  isInteger,
  isObject,
  isText,
} from "./validation.utils.ts";

const $checkLang = (errors: string[], lang: unknown) => {
  const path = "lang.yml";

  if (!isObject(lang) || !Object.keys(lang).length) {
    errors.push(`${path} must have at least one language`);
    return;
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

const $checkSheet = (errors: string[], sheet: unknown): string[] => {
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

const $checkData = (
  errors: string[],
  furnitureId: string,
  data: unknown,
  frames: string[],
) => {
  const path = "data.yml";

  const hasValidDataKeys = checkKeys(
    errors,
    path,
    data,
    ["id", "type", "revision", "icon", "size", "direction"],
    ["actions"],
  );

  if (!hasValidDataKeys) return;

  if (data.id !== furnitureId) {
    errors.push(`${path}.id must be '${furnitureId}'`);
  }

  if (!COLLECTION_FURNITURE_TYPES.includes(data.type)) {
    errors.push(
      `${path}.type must be one of ${COLLECTION_FURNITURE_TYPES.join(", ")}`,
    );
  }

  const checkTexture = ($path: string, texture: unknown) => {
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

  const hasValidDirectionKeys = checkKeys(
    errors,
    `${path}.direction`,
    data.direction,
    [],
    [...COLLECTION_FURNITURE_DIRECTIONS],
  );

  if (!hasValidDirectionKeys) return;

  for (const [direction, directionData] of Object.entries(data.direction)) {
    const $path = `${path}.direction.${direction}`;

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
};

export const getFurnitureLangErrors = (lang: unknown): string[] => {
  const errors: string[] = [];
  $checkLang(errors, lang);
  return errors;
};

export const getFurnitureSheetErrors = (sheet: unknown): string[] => {
  const errors: string[] = [];
  $checkSheet(errors, sheet);
  return errors;
};

export const getFurnitureSheetFrames = (sheet: unknown): string[] =>
  $checkSheet([], sheet);

export const getFurnitureDataErrors = (
  furnitureId: string,
  data: unknown,
  frames: string[],
): string[] => {
  const errors: string[] = [];
  $checkData(errors, furnitureId, data, frames);
  return errors;
};

export const getFurnitureFilesErrors = (
  furnitureId: string,
  {
    data,
    sheet,
    lang,
  }: {
    data: unknown;
    sheet: unknown;
    lang: unknown;
  },
): string[] => {
  const errors: string[] = [];

  $checkLang(errors, lang);
  const frames = $checkSheet(errors, sheet);
  $checkData(errors, furnitureId, data, frames);

  return errors;
};

export const getFurnitureImmutableData = (
  data: FurnitureDataFile,
): CollectionFurnitureImmutableData => ({
  type: data.type,
  size: {
    width: data.size.width,
    height: data.size.height,
    depth: data.size.depth,
  },
  directions: Object.keys(data.direction).sort(),
  // actions: [], // TODO: implement actions validation, not sure if should be part of immutable data or not
});
