import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  CharacterDirection,
  CharacterPart,
} from "shared/enums";
import { Point2d } from "shared/types/point.types";
import { DirectionKeys } from "shared/types/direction.types";

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
  visible?: boolean;
  pivot: Point2d;
  zIndex?: number;
};

////////////////////////
type CharacterPartTypes = "body" | "head" | "left_arm" | "right_arm";

export type CharacterDirectionData = {
  target: string;
  scale: number;
  frames: Record<string, CharacterFrame>;
};

export type CharacterFrame = {
  body: {
    pivot: Point2d;
    position: Point2d;
  };
  head: {
    pivot: Point2d;
  };
  left_arm: {
    target: string;
    visible: false;
    zIndex: number;
    pivot: Point2d;
  };
  right_arm: {
    target: string;
    visible: false;
    zIndex: number;
    pivot: Point2d;
  };
};

export type CharacterFramesData = Record<DirectionKeys, CharacterDirectionData>;

export type CharacterFixesData = {
  match: Partial<
    Record<
      CharacterPartTypes,
      {
        direction?: string;
        action?: string;
      }
    >
  >[];
  exec: Partial<
    Record<
      CharacterPartTypes,
      {
        pivot?: Point2d;
      }
    >
  >;
}[];

export type CharacterAnimationsData = {
  north: {
    idle: {
      frames: [
        {
          body: {
            frame: "idle";
            pivot: Point2d;
            direction: "north";
          };
          head: {
            frame: "idle";
            pivot: Point2d;
            direction: "north";
          };
        },
      ];
    };
    walk: {
      frames: [
        {
          body: {
            frame: "walk_0";
            pivot: Point2d;
            direction: "north";
          };
          head: {
            frame: "idle";
            pivot: Point2d;
            direction: "north";
          };
        },
      ];
    };
  };
};
