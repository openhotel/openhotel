import React from "react";
import { ContainerComponent } from "@oh/pixi-components";
import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  Direction,
} from "shared/enums";
import { TILE_SIZE } from "shared/consts";
import { ArmComponent, BodyComponent, HeadComponent } from "./components";
import { useCharacter } from "shared/hooks";

type Props = {
  bodyAction: CharacterBodyAction;
  bodyDirection: Direction;
  headDirection: Direction;
  leftArmAction: CharacterArmAction;
  rightArmAction: CharacterArmAction;
  skinColor: number;
};

export const CharacterComponent: React.FC<Props> = ({
  bodyAction,
  bodyDirection,
  headDirection,
  leftArmAction,
  rightArmAction,
  skinColor,
}) => {
  const { getBodyData } = useCharacter();

  if (!getBodyData(bodyDirection, bodyAction)) return null;

  return (
    <ContainerComponent
      position={{
        x: (TILE_SIZE.width + 2) / 2,
        y: TILE_SIZE.height / 2,
      }}
      // alpha={0.5}
    >
      <BodyComponent
        action={bodyAction}
        direction={bodyDirection}
        skinColor={skinColor}
      >
        <HeadComponent
          skinColor={skinColor}
          bodyDirection={bodyDirection}
          bodyAction={bodyAction}
          direction={headDirection}
        />
        <ArmComponent
          skinColor={skinColor}
          bodyDirection={bodyDirection}
          bodyAction={bodyAction}
          side={CharacterArmSide.LEFT}
          action={leftArmAction}
        />
        <ArmComponent
          skinColor={skinColor}
          bodyDirection={bodyDirection}
          bodyAction={bodyAction}
          side={CharacterArmSide.RIGHT}
          action={rightArmAction}
        />
      </BodyComponent>
    </ContainerComponent>
  );
};
