import {
  COLLECTION_FURNITURE_MAX_SIZE,
  getFurnitureLangErrors,
} from "@oh/core";
import { CollectionFurniture } from "shared/types";

export const getCollectionFurnitureErrors = (
  furniture: CollectionFurniture,
): string[] => {
  const errors: string[] = [];
  const { id, size, lang, filename } = furniture;

  if (filename && filename !== `${id}.furniture`) {
    errors.push(`file name '${filename}' doesn't match id`);
  }

  if (size > COLLECTION_FURNITURE_MAX_SIZE) {
    errors.push(`file is bigger than ${COLLECTION_FURNITURE_MAX_SIZE} bytes`);
  }

  errors.push(...getFurnitureLangErrors(lang));

  return errors;
};
