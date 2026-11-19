import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  CharacterDirection,
  CharacterPart,
} from "shared/enums";
import { DirectionKeys } from "@shared/types/direction.types.ts";
import { Point } from "@shared/types/point.types.ts";

export type CharacterBodyPartId =
  | CharacterPart
  | CharacterDirection
  | CharacterBodyAction
  | CharacterArmSide
  | CharacterArmAction;

export type CharacterBodyData = {
  pivot: Point;
};

export type CharacterHeadData = {
  pivot: Point;
};
export type CharacterArmData = {
  visible?: boolean;
  pivot: Point;
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
    pivot: Point;
    position: Point;
  };
  head: {
    pivot: Point;
  };
  left_arm: {
    target: string;
    visible: false;
    zIndex: number;
    pivot: Point;
  };
  right_arm: {
    target: string;
    visible: false;
    zIndex: number;
    pivot: Point;
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
        pivot?: Point;
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
            pivot: Point;
            direction: "north";
          };
          head: {
            frame: "idle";
            pivot: Point;
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
            pivot: Point;
            direction: "north";
          };
          head: {
            frame: "idle";
            pivot: Point;
            direction: "north";
          };
        },
      ];
    };
  };
};
