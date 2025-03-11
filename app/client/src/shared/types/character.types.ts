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
  visible?: boolean;
  pivot: Point2d;
  zIndex?: number;
};

////////////////////////

export type CharacterFramesData = {
  north: {
    idle: {
      body: {
        pivot: Point2d;
      };
      head: {
        pivot: Point2d;
      };
    };
    walk_0: {
      body: {
        pivot: Point2d;
      };
      head: {
        pivot: Point2d;
      };
    };
    walk_1: {
      body: {
        pivot: Point2d;
      };
      head: {
        pivot: Point2d;
      };
    };
  };
};

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
