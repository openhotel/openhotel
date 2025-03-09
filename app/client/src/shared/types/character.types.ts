import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  CharacterDirection,
  CharacterPart,
} from "shared/enums";
import { Point2d } from "shared/types/point.types";

export type CharacterBodyPartId =
  | CharacterPart
  | CharacterDirection
  | CharacterBodyAction
  | CharacterArmSide
  | CharacterArmAction;

export type CharacterBodyData = {
  pivot: Point2d;
};

export type CharacterHeadData = {
  pivot: Point2d;
};
export type CharacterArmData = {
  pivot: Point2d;
  zIndex?: number;
};
