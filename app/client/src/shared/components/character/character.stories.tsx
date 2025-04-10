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

//@ts-ignore
export const Character: Story = () => {
  const [bodyDirection, setBodyDirection] = useState<Direction>(Direction.EAST);
  const [headDirection, setHeadDirection] = useState<Direction>(null);
  const [bodyAnimation, setBodyAnimation] = useState<CharacterBodyAction>(
    CharacterBodyAction.IDLE,
  );
  const [leftArmAction, setLeftArmAction] = useState<CharacterArmAction>(
    CharacterArmAction.ARM_WAVE_0,
  );
  const [rightArmAction, setRightArmAction] = useState<CharacterArmAction>(
    CharacterArmAction.ARM_WAVE_0,
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setBodyAnimation((action) => {
        if (CharacterBodyAction.WALK_0 > action) return action;

        action++;
        if (action > CharacterBodyAction.WALK_3)
          action = CharacterBodyAction.WALK_0;
        return action;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [setBodyAnimation]);

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
    setBodyAnimation((action) => {
      if (action >= CharacterBodyAction.WALK_0) return CharacterBodyAction.IDLE;
      return action + 1;
    });
  }, [setBodyAnimation]);

  const onToggleRightArm = useCallback(() => {
    setRightArmAction((action) => {
      if (action >= CharacterArmAction.ARM_WAVE_0)
        return CharacterArmAction.IDLE;
      return action + 1;
    });
  }, [setRightArmAction]);

  const onToggleLeftArm = useCallback(() => {
    setLeftArmAction((action) => {
      if (action >= CharacterArmAction.ARM_WAVE_0)
        return CharacterArmAction.IDLE;
      return action + 1;
    });
  }, [setLeftArmAction]);

  const onToggleHead = useCallback(() => {
    setHeadDirection((direction) => {
      if (direction === null) return Direction.NORTH;
      if (direction >= Direction.NORTH_WEST) return null;
      return direction + 1;
    });
  }, [setBodyAnimation, bodyDirection]);

  return (
    <ContainerComponent
      position={{
        y: 55,
      }}
    >
      <CharacterComponent
        bodyDirection={bodyDirection}
        headDirection={headDirection ?? bodyDirection}
        leftArmAction={leftArmAction}
        rightArmAction={rightArmAction}
        bodyAction={bodyAnimation}
        skinColor={0xefcfb1}
        position={{ x: 0, y: 0, z: 0 }}
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
          x: 0,
          y: 45,
        }}
      />
      <TextComponent
        text={`- BODY: ${CharacterBodyAction[bodyAnimation]}`}
        position={{
          x: 0,
          y: 52,
        }}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onToggleAction}
      />

      <TextComponent
        text={`- LEFT_ARM: ${CharacterArmAction[leftArmAction]}`}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onToggleLeftArm}
        position={{
          x: 0,
          y: 60,
        }}
      />
      <TextComponent
        text={`- RIGHT_ARM: ${CharacterArmAction[rightArmAction]}`}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onToggleRightArm}
        position={{
          x: 0,
          y: 68,
        }}
      />
      <TextComponent
        text={`- HEAD DIRECTION: ${Direction[headDirection]}`}
        position={{
          x: 0,
          y: 76,
        }}
        eventMode={EventMode.STATIC}
        cursor={Cursor.POINTER}
        onPointerDown={onToggleHead}
      />
    </ContainerComponent>
  );
};
