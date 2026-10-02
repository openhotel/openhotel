// TODO: Move to shared @oh/utils
export const COLLECTION_RESERVED_NAMESPACES = ["default", "openhotel"];

export const COLLECTION_ID_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const COLLECTION_ID_MAX_LENGTH = 32;
export const COLLECTION_HOTEL_VERSION_REGEX =
  /^v?\d+\.\d+\.\d+(-[a-z]+(\.\d+)?)?$/;

export const COLLECTION_LABEL_MAX_LENGTH = 64;
export const COLLECTION_DESCRIPTION_MAX_LENGTH = 256;

export const COLLECTION_MAX_FURNITURE = 250;
export const COLLECTION_FURNITURE_MAX_SIZE = 1024 * 1024;
