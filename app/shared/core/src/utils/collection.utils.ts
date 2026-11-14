import {
  COLLECTION_DESCRIPTION_MAX_LENGTH,
  COLLECTION_FORMAT_VERSION,
  COLLECTION_HOTEL_VERSION_REGEX,
  COLLECTION_ID_MAX_LENGTH,
  COLLECTION_ID_REGEX,
  COLLECTION_LABEL_MAX_LENGTH,
  COLLECTION_LICENSE_MAX_LENGTH,
  COLLECTION_MAX_FURNITURE,
  COLLECTION_RESERVED_NAMESPACES,
} from "../consts/collection.consts.ts";
import type { CollectionManifest } from "../types/main.ts";
import {
  isInteger,
  isObject,
  isOptionalText,
  isText,
} from "./validation.utils.ts";

const SHA256_REGEX = /^[a-f0-9]{64}$/;

export const getSha256 = async (data: Uint8Array): Promise<string> =>
  Array.from(
    new Uint8Array(await crypto.subtle.digest("SHA-256", data as BufferSource)),
  )
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

export const getStableJson = (value: unknown): string => {
  if (Array.isArray(value)) {
    return `[${value.map((item) => getStableJson(item ?? null)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    return `{${Object.keys(object)
      .filter((key) => object[key] !== undefined)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${getStableJson(object[key])}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
};

export const isValidHotelVersion = (version: unknown): boolean =>
  typeof version === "string" && COLLECTION_HOTEL_VERSION_REGEX.test(version);

export const isValidCollectionId = (id: unknown): id is string =>
  typeof id === "string" &&
  id.length <= COLLECTION_ID_MAX_LENGTH &&
  COLLECTION_ID_REGEX.test(id) &&
  !COLLECTION_RESERVED_NAMESPACES.includes(id);

export const isValidCollectionFurnitureId = (
  collectionId: string,
  furnitureId: unknown,
): furnitureId is string => {
  if (typeof furnitureId !== "string") return false;

  const [prefix, name, ...rest] = furnitureId.split("@");
  return (
    prefix === collectionId &&
    !rest.length &&
    COLLECTION_ID_REGEX.test(name ?? "")
  );
};

const $checkCategory = (errors: string[], category: unknown) => {
  const $category = isObject(category) ? category : {};

  if (!isText($category.label, COLLECTION_LABEL_MAX_LENGTH)) {
    errors.push("category.label is not valid");
  }

  if (
    !isOptionalText($category.description, COLLECTION_DESCRIPTION_MAX_LENGTH)
  ) {
    errors.push("category.description is not valid");
  }
};

const $checkLicense = (errors: string[], license: unknown) => {
  if (!isOptionalText(license, COLLECTION_LICENSE_MAX_LENGTH)) {
    errors.push("license is not valid");
  }
};

export const getCollectionMetadataErrors = (metadata: unknown): string[] => {
  const errors: string[] = [];
  const { id, category, license, minHotelVersion } = isObject(metadata)
    ? metadata
    : ({} as Record<string, any>);

  if (!isValidCollectionId(id)) {
    errors.push(`id '${id}' is not valid`);
  }

  if (!isValidHotelVersion(minHotelVersion)) {
    errors.push("minHotelVersion is not a valid version");
  }

  $checkCategory(errors, category);
  $checkLicense(errors, license);

  return errors;
};

export const getCollectionFurnitureListErrors = (
  collectionId: string,
  furnitureIds: string[],
): string[] => {
  const errors: string[] = [];

  if (!furnitureIds.length || furnitureIds.length > COLLECTION_MAX_FURNITURE) {
    errors.push(
      `a collection must have between 1 and ${COLLECTION_MAX_FURNITURE} furniture`,
    );
  }

  const ids = new Set<string>();
  for (const furnitureId of furnitureIds) {
    if (ids.has(furnitureId)) {
      errors.push(`${furnitureId}: id is duplicated`);
    }
    ids.add(furnitureId);

    if (!isValidCollectionFurnitureId(collectionId, furnitureId)) {
      errors.push(`${furnitureId}: id must be '${collectionId}@<name>'`);
    }
  }

  return errors;
};

export const getCollectionManifestErrors = (manifest: unknown): string[] => {
  if (!isObject(manifest)) return ["manifest must be an object"];

  const errors: string[] = [];
  const {
    id,
    version,
    author,
    license,
    minHotelVersion,
    formatVersion,
    category,
    furniture,
    signature,
  } = manifest;

  if (!isValidCollectionId(id)) {
    errors.push(`id '${id}' is not valid`);
  }

  if (!isInteger(version, 1)) {
    errors.push("version must be an integer >= 1");
  }

  if (typeof author !== "string" || !author) {
    errors.push("author is not valid");
  }

  $checkLicense(errors, license);

  if (!isValidHotelVersion(minHotelVersion)) {
    errors.push("minHotelVersion is not a valid version");
  }

  if (formatVersion !== COLLECTION_FORMAT_VERSION) {
    errors.push(`formatVersion '${formatVersion}' is not supported`);
  }

  $checkCategory(errors, category);

  if (
    signature !== undefined &&
    (typeof signature !== "string" || !signature)
  ) {
    errors.push("signature is not valid");
  }

  if (
    !Array.isArray(furniture) ||
    !furniture.length ||
    furniture.length > COLLECTION_MAX_FURNITURE
  ) {
    errors.push(
      `furniture must be a list of 1 to ${COLLECTION_MAX_FURNITURE} items`,
    );
    return errors;
  }

  const ids = new Set<string>();
  furniture.forEach((item: unknown, index: number) => {
    const path = `furniture[${index}]`;

    if (!isObject(item)) {
      errors.push(`${path} must be an object`);
      return;
    }

    if (!isValidCollectionFurnitureId(id, item.id)) {
      errors.push(`${path}.id must be '${id}@<name>'`);
    } else if (ids.has(item.id)) {
      errors.push(`${path}.id '${item.id}' is duplicated`);
    } else {
      ids.add(item.id);
    }

    if (typeof item.revision !== "string" || !item.revision) {
      errors.push(`${path}.revision is not valid`);
    }

    if (typeof item.sha256 !== "string" || !SHA256_REGEX.test(item.sha256)) {
      errors.push(`${path}.sha256 is not valid`);
    }
  });

  return errors;
};

export const getCollectionManifestPayload = ({
  signature,
  ...manifest
}: CollectionManifest): Uint8Array =>
  new TextEncoder().encode(getStableJson(manifest));

const $decodeBase64 = (text: string): Uint8Array =>
  Uint8Array.from(atob(text), (char) => char.charCodeAt(0));

export const verifyCollectionManifest = async (
  manifest: CollectionManifest,
  publicKeys: string[],
): Promise<boolean> => {
  if (typeof manifest?.signature !== "string") return false;

  let signature: Uint8Array;
  try {
    signature = $decodeBase64(manifest.signature);
  } catch {
    return false;
  }

  const payload = getCollectionManifestPayload(manifest);

  for (const x of publicKeys) {
    try {
      const publicKey = await crypto.subtle.importKey(
        "jwk",
        { kty: "OKP", crv: "Ed25519", x },
        "Ed25519",
        false,
        ["verify"],
      );

      const isValid = await crypto.subtle.verify(
        "Ed25519",
        publicKey,
        signature as BufferSource,
        payload as BufferSource,
      );

      if (isValid) return true;
    } catch {}
  }

  return false;
};
