import { CharacterBodyPartId } from "shared/types";

export const getCharacterBodyPart = (...id: CharacterBodyPartId[]) =>
  id.join("");
