import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  CharacterDirection,
  CharacterPart,
} from "shared/enums";

export type CharacterBodyPartId =
  | CharacterPart
  | CharacterDirection
  | CharacterBodyAction
  | CharacterArmSide
  | CharacterArmAction;
