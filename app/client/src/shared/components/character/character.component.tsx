import React, { useMemo } from "react";
import { ContainerComponent } from "@oh/pixi-components";
import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  Direction,
} from "shared/enums";
import {
  CHARACTER_DIRECTION_MAP,
  CHARACTER_DIRECTION_SCALE_MAP,
  TILE_SIZE,
} from "shared/consts";
import { ArmComponent, BodyComponent, HeadComponent } from "./components";

type Props = {
  action: CharacterBodyAction;
  bodyDirection: Direction;
  headDirection: Direction;
  leftArmAction: CharacterArmAction;
  rightArmAction: CharacterArmAction;
  skinColor: number;
};

export const CharacterComponent: React.FC<Props> = ({
  action,
  bodyDirection,
  headDirection,
  leftArmAction,
  rightArmAction,
  skinColor,
}) => {
  const bodyCharacterDirection = useMemo(
    () => CHARACTER_DIRECTION_MAP[bodyDirection],
    [bodyDirection],
  );
  const headCharacterDirection = useMemo(
    () => CHARACTER_DIRECTION_MAP[headDirection],
    [headDirection],
  );

  const bodyScale = useMemo(
    () => CHARACTER_DIRECTION_SCALE_MAP[bodyDirection],
    [bodyDirection],
  );
  const headScale = useMemo(
    () => CHARACTER_DIRECTION_SCALE_MAP[headDirection],
    [headDirection],
  );

  return (
    <ContainerComponent
      position={{
        x: (TILE_SIZE.width + 2) / 2,
        y: TILE_SIZE.height / 2,
      }}
    >
      <BodyComponent
        action={action}
        direction={bodyCharacterDirection}
        skinColor={skinColor}
        scale={bodyScale}
      >
        <HeadComponent
          skinColor={skinColor}
          direction={headCharacterDirection}
          scale={headScale}
        />
        <ArmComponent
          skinColor={skinColor}
          bodyDirection={bodyCharacterDirection}
          bodyScale={bodyScale}
          side={CharacterArmSide.LEFT}
          action={leftArmAction}
        />
        <ArmComponent
          skinColor={skinColor}
          bodyDirection={bodyCharacterDirection}
          bodyScale={bodyScale}
          side={CharacterArmSide.RIGHT}
          action={rightArmAction}
        />
      </BodyComponent>
    </ContainerComponent>
  );
};
