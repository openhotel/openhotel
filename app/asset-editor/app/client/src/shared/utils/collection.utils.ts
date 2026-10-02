import {
  COLLECTION_DESCRIPTION_MAX_LENGTH,
  COLLECTION_FURNITURE_MAX_SIZE,
  COLLECTION_HOTEL_VERSION_REGEX,
  COLLECTION_ID_MAX_LENGTH,
  COLLECTION_ID_REGEX,
  COLLECTION_LABEL_MAX_LENGTH,
  COLLECTION_MAX_FURNITURE,
  COLLECTION_RESERVED_NAMESPACES,
} from "shared/consts";
import { CollectionFurniture, CollectionMetadata } from "shared/types";
import { getFurnitureLangErrors } from "./lang.utils";

const isOptionalText = (value: string | undefined, maxLength: number) =>
  !value?.trim().length || value.length <= maxLength;

// TODO: Move to shared @oh/utils, same rules as onet
export const getCollectionErrors = (
  collection: CollectionMetadata,
): string[] => {
  const errors: string[] = [];
  const { id, category, minHotelVersion } = collection;

  if (
    !id ||
    id.length > COLLECTION_ID_MAX_LENGTH ||
    !COLLECTION_ID_REGEX.test(id) ||
    COLLECTION_RESERVED_NAMESPACES.includes(id)
  ) {
    errors.push(
      `id must be lowercase letters, numbers and dashes (max ${COLLECTION_ID_MAX_LENGTH})`,
    );
  }

  if (!COLLECTION_HOTEL_VERSION_REGEX.test(minHotelVersion ?? "")) {
    errors.push("minHotelVersion must be a version like 1.0.0");
  }

  if (
    !category?.label?.length ||
    category.label.length > COLLECTION_LABEL_MAX_LENGTH
  ) {
    errors.push(
      `category.label is required (max ${COLLECTION_LABEL_MAX_LENGTH})`,
    );
  }

  if (
    !isOptionalText(category?.description, COLLECTION_DESCRIPTION_MAX_LENGTH)
  ) {
    errors.push(
      `category.description must be at most ${COLLECTION_DESCRIPTION_MAX_LENGTH} characters`,
    );
  }

  return errors;
};

export const getCollectionFurnitureErrors = (
  collectionId: string,
  furniture: CollectionFurniture,
): string[] => {
  const errors: string[] = [];
  const { id, size, lang, filename } = furniture;

  const [prefix, name, ...rest] = id.split("@");
  if (
    prefix !== collectionId ||
    rest.length ||
    !COLLECTION_ID_REGEX.test(name ?? "")
  ) {
    errors.push(`id must be '${collectionId || "<collection>"}@<name>'`);
  }

  if (filename && filename !== `${id}.furniture`) {
    errors.push(`file name '${filename}' doesn't match id`);
  }

  if (size > COLLECTION_FURNITURE_MAX_SIZE) {
    errors.push(`file is bigger than ${COLLECTION_FURNITURE_MAX_SIZE} bytes`);
  }

  errors.push(...getFurnitureLangErrors(lang));

  return errors;
};

export const getCollectionFurnitureListErrors = (
  furniture: CollectionFurniture[],
): string[] => {
  const errors: string[] = [];

  if (!furniture.length || furniture.length > COLLECTION_MAX_FURNITURE) {
    errors.push(
      `a collection must have between 1 and ${COLLECTION_MAX_FURNITURE} furniture`,
    );
  }

  const ids = furniture.map(({ id }) => id);
  const duplicatedIds = new Set(
    ids.filter((id, index) => ids.indexOf(id) !== index),
  );

  for (const id of duplicatedIds) {
    errors.push(`${id} is duplicated`);
  }

  return errors;
};
