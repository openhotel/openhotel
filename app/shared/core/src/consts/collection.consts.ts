export const COLLECTION_RESERVED_NAMESPACES = ["default", "openhotel"];

export const COLLECTION_ID_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const COLLECTION_ID_MAX_LENGTH = 32;

export const COLLECTION_HOTEL_VERSION_REGEX =
  /^v?\d+\.\d+\.\d+(-[a-z]+(\.\d+)?)?$/;

export const COLLECTION_FORMAT_VERSION = 1;

export const COLLECTION_LABEL_MAX_LENGTH = 64;
export const COLLECTION_DESCRIPTION_MAX_LENGTH = 256;
export const COLLECTION_LICENSE_MAX_LENGTH = 64;

export const COLLECTION_MAX_FURNITURE = 250;
export const COLLECTION_FURNITURE_MAX_SIZE = 1024 * 1024;
export const COLLECTION_FURNITURE_MAX_UNCOMPRESSED_SIZE = 4 * 1024 * 1024;

export const COLLECTION_LANG_CODE_REGEX = /^[a-z]{2}$/;
export const COLLECTION_LANG_NAME_MAX_LENGTH = 64;
export const COLLECTION_LANG_DESCRIPTION_MAX_LENGTH = 256;

export const COLLECTION_FURNITURE_FILES = [
  "data.yml",
  "sheet.json",
  "sprite.png",
  "lang.yml",
];

export const COLLECTION_FURNITURE_TYPES = ["furniture", "frame"];
export const COLLECTION_FURNITURE_DIRECTIONS = [
  "north",
  "east",
  "south",
  "west",
];
