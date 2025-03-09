import { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { CharacterComponent } from "./character.component";
import { ContainerComponent } from "@oh/pixi-components";
import { PrivateRoomTile } from "shared/components/private-room/components";
import {
  CharacterArmAction,
  CharacterBodyAction,
  Direction,
} from "shared/enums";

export default {
  title: "Shared/Character",
  component: CharacterComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof CharacterComponent>;

type Story = StoryObj<typeof CharacterComponent>;

export const Character: Story = () => {
  const [bodyDirection, setBodyDirection] = useState<Direction>(
    Direction.NORTH,
  );
  const [headDirection, setHeadDirection] = useState<Direction>(
    Direction.NORTH,
  );
  const [action, setAction] = useState<CharacterBodyAction>(
    CharacterBodyAction.IDLE,
  );
  const [leftArmAction, setLeftArmAction] = useState<CharacterArmAction>(
    CharacterArmAction.IDLE,
  );
  const [rightArmAction, setRightArmAction] = useState<CharacterArmAction>(
    CharacterArmAction.IDLE,
  );

  // useEffect(() => {
  //   setTimeout(() => {
  //     setAction(CharacterBodyAction.SIT);
  //   }, 1000);
  // }, [setAction]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDirection((direction) => {
  //       let $direction = direction + 1;
  //       if ($direction > Direction.NORTH_WEST) $direction = Direction.NORTH;
  //       return $direction;
  //     });
  //   }, 1500);
  //
  //   return () => {
  //     clearInterval(interval);
  //   };
  // });

  return (
    <ContainerComponent
      position={{
        y: 50,
      }}
    >
      <CharacterComponent
        bodyDirection={bodyDirection}
        headDirection={headDirection}
        leftArmAction={leftArmAction}
        rightArmAction={rightArmAction}
        action={action}
        skinColor={0xefcfb1}
      />
      <PrivateRoomTile position={{ x: 0, y: 0, z: 0 }} />
    </ContainerComponent>
  );
};
