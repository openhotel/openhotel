import { Meta, StoryObj } from "@storybook/react";
import React, { useCallback, useState } from "react";
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
  const [bodyDirection, setBodyDirection] = useState<Direction>(
    Direction.NORTH_WEST,
  );
  const [headDirection, setHeadDirection] = useState<Direction>(null);
  const [action, setAction] = useState<CharacterBodyAction>(
    CharacterBodyAction.IDLE,
  );
  const [leftArmAction, setLeftArmAction] = useState<CharacterArmAction>(
    CharacterArmAction.IDLE,
  );
  const [rightArmAction, setRightArmAction] = useState<CharacterArmAction>(
    CharacterArmAction.IDLE,
  );

  console.log(Direction[bodyDirection]);
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
    </ContainerComponent>
  );
};
