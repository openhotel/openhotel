import { Meta, StoryObj } from "@storybook/react";
import React, { useCallback, useEffect, useState } from "react";
import { CharacterComponent } from "./character.component";
import {
  ContainerComponent,
  Cursor,
  EventMode,
  FLEX_JUSTIFY,
  FlexContainerComponent,
} from "@oh/pixi-components";
import { PrivateRoomTile } from "shared/components/private-room/components";
import {
  CharacterArmAction,
  CharacterBodyAction,
  Direction,
} from "shared/enums";
import { TextComponent } from "shared/components/text";

export default {
  title: "Shared/Character",
  component: CharacterComponent,
  parameters: {
    layout: "fullscreen",
  },
} as Meta<typeof CharacterComponent>;

type Story = StoryObj<typeof CharacterComponent>;

export const Character: Story = () => {
  const [bodyDirection, setBodyDirection] = useState<Direction>(Direction.EAST);
  const [headDirection, setHeadDirection] = useState<Direction>(null);
  const [action, setAction] = useState<CharacterBodyAction>(
    CharacterBodyAction.WALK_3,
  );
  const [leftArmAction, setLeftArmAction] = useState<CharacterArmAction>(
    CharacterArmAction.IDLE,
  );
  const [rightArmAction, setRightArmAction] = useState<CharacterArmAction>(
    CharacterArmAction.IDLE,
  );

  useEffect(() => {
    // return;
    const interval = setInterval(() => {
      setAction((action) => {
        if (CharacterBodyAction.WALK_0 > action) return action;

        action++;
        if (action > CharacterBodyAction.WALK_3)
          action = CharacterBodyAction.WALK_0;
        return action;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [setAction]);

  const onPointerLeft = useCallback(() => {
    setBodyDirection((direction) => {
      direction++;
      if (direction > Direction.NORTH_WEST) direction = Direction.NORTH;
      return direction;
    });
  }, [setBodyDirection]);

  const onPointerRight = useCallback(() => {
    setBodyDirection((direction) => {
      direction--;
      if (0 > direction) direction = Direction.NORTH_WEST;
      return direction;
    });
  }, [setBodyDirection]);

  const onToggleAction = useCallback(() => {
    setAction((action) => {
      if (action >= CharacterBodyAction.WALK_0) return CharacterBodyAction.IDLE;
      return action + 1;
    });
  }, [setAction]);

  return (
    <ContainerComponent
      position={{
        y: 55,
      }}
    >
      {/*<CharacterComponent*/}
      {/*  bodyDirection={bodyDirection}*/}
      {/*  headDirection={headDirection ?? bodyDirection}*/}
      {/*  leftArmAction={leftArmAction}*/}
      {/*  rightArmAction={rightArmAction}*/}
      {/*  bodyAction={CharacterBodyAction.IDLE}*/}
      {/*  skinColor={0xefcfb1}*/}
      {/*/>*/}
      <CharacterComponent
        bodyDirection={bodyDirection}
        headDirection={headDirection ?? bodyDirection}
        leftArmAction={leftArmAction}
        rightArmAction={rightArmAction}
        bodyAction={action}
        skinColor={0xefcfb1}
      />
      <PrivateRoomTile position={{ x: 0, y: 0, z: 0 }} />

      <FlexContainerComponent
        position={{
          y: 35,
        }}
        size={{ width: 50 }}
        justify={FLEX_JUSTIFY.SPACE_EVENLY}
      >
        <TextComponent
          text="<<"
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
          onPointerDown={onPointerLeft}
        />
        <TextComponent
          text=">>"
          eventMode={EventMode.STATIC}
          cursor={Cursor.POINTER}
          onPointerDown={onPointerRight}
        />
      </FlexContainerComponent>
      <TextComponent
        text={Direction[bodyDirection]}
        position={{
          x: 10,
          y: 45,
        }}
      />
      <TextComponent
        text={CharacterBodyAction[action]}
        position={{
          x: 10,
          y: 52,
        }}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onToggleAction}
      />
    </ContainerComponent>
  );
};
