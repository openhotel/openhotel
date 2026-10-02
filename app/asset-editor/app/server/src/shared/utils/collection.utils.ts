import {
  COLLECTION_DESCRIPTION_MAX_LENGTH,
  COLLECTION_FURNITURE_MAX_SIZE,
  COLLECTION_HOTEL_VERSION_REGEX,
  COLLECTION_ID_MAX_LENGTH,
  COLLECTION_ID_REGEX,
  COLLECTION_LABEL_MAX_LENGTH,
  COLLECTION_MAX_FURNITURE,
  COLLECTION_RESERVED_NAMESPACES,
} from "shared/consts/collection.consts.ts";

const getOptionalText = (value: unknown) =>
  typeof value === "string" && value.trim().length ? value.trim() : undefined;

export const normalizeCollection = (collection: any) => {
  const description = getOptionalText(collection?.category?.description);

  return {
    id: collection?.id,
    category: {
      label: collection?.category?.label,
      ...(description ? { description } : {}),
    },
    minHotelVersion: collection?.minHotelVersion,
  };
};

const isOptionalText = (value: unknown, maxLength: number) =>
  value === undefined ||
  (typeof value === "string" && value.length > 0 && value.length <= maxLength);

// TODO: Move to shared @oh/utils, same rules as onet
export const getCollectionErrors = (collection: any): string[] => {
  const errors: string[] = [];
  const { id, category, minHotelVersion } = collection ?? {};

  if (
    typeof id !== "string" ||
    id.length > COLLECTION_ID_MAX_LENGTH ||
    !COLLECTION_ID_REGEX.test(id) ||
    COLLECTION_RESERVED_NAMESPACES.includes(id)
  ) {
    errors.push("id is not valid");
  }

  if (
    typeof minHotelVersion !== "string" ||
    !COLLECTION_HOTEL_VERSION_REGEX.test(minHotelVersion)
  ) {
    errors.push("minHotelVersion is not a valid version");
  }

  if (
    typeof category?.label !== "string" ||
    !category.label.length ||
    category.label.length > COLLECTION_LABEL_MAX_LENGTH
  ) {
    errors.push("category.label is not valid");
  }

  if (
    !isOptionalText(category?.description, COLLECTION_DESCRIPTION_MAX_LENGTH)
  ) {
    errors.push("category.description is not valid");
  }

  return errors;
};

export const getCollectionFurnitureErrors = (
  collectionId: string,
  furniture: { id: string; size: number }[],
): string[] => {
  const errors: string[] = [];

  if (!furniture.length || furniture.length > COLLECTION_MAX_FURNITURE) {
    errors.push(
      `a collection must have between 1 and ${COLLECTION_MAX_FURNITURE} furniture`,
    );
  }

  const ids: string[] = [];
  for (const { id, size } of furniture) {
    if (ids.includes(id)) {
      errors.push(`${id}: is duplicated`);
    }
    ids.push(id);

    const [prefix, name, ...rest] = `${id}`.split("@");
    if (
      prefix !== collectionId ||
      rest.length ||
      !COLLECTION_ID_REGEX.test(name ?? "")
    ) {
      errors.push(`${id}: id must be '${collectionId}@<name>'`);
    }

    if (size > COLLECTION_FURNITURE_MAX_SIZE) {
      errors.push(
        `${id}: file is bigger than ${COLLECTION_FURNITURE_MAX_SIZE} bytes`,
      );
    }
  }

  return errors;
};
