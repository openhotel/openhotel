import React from "react";
import { ContainerComponent, ContainerProps } from "@oh/pixi-components";
import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  Direction,
} from "shared/enums";
import { TILE_SIZE } from "shared/consts";
import { ArmComponent, BodyComponent, HeadComponent } from "./components";
import { Point3d } from "shared/types";
import { getPositionFromIsometricPosition } from "shared/utils";

type Props = {
  bodyAction: CharacterBodyAction;
  bodyDirection: Direction;
  headDirection: Direction;
  leftArmAction: CharacterArmAction;
  rightArmAction: CharacterArmAction;
  skinColor: number;

  position: Point3d;
} & ContainerProps;

export const CharacterComponent: React.FC<Props> = ({
  bodyAction,
  bodyDirection,
  headDirection,
  leftArmAction,
  rightArmAction,
  skinColor,

  position,
  ...containerProps
}) => {
  // const { data } = useCharacter();
  //
  // const [bodyAction, setBodyAction] = useState<CharacterBodyAction>(null);
  //
  // useEffect(() => {
  //   const animationBodyActions =
  //     CHARACTER_BODY_ANIMATION_MAP?.[bodyDirection]?.[bodyAnimation];
  //
  //   if (!Array.isArray(animationBodyActions))
  //     return setBodyAction(animationBodyActions);
  //
  //   setBodyAction(animationBodyActions[0]);
  //   return System.tasks.add({
  //     type: TickerQueue.REPEAT,
  //     repeatEvery: 120,
  //     repeats: undefined,
  //     onFunc: () => {
  //       setBodyAction((animation) => {
  //         const index = animationBodyActions.indexOf(animation) + 1;
  //         return animationBodyActions[index] ?? animationBodyActions[0];
  //       });
  //     },
  //   });
  // }, [bodyAnimation, bodyDirection, setBodyAction]);
  //
  // if (
  //   bodyAction === null ||
  //   isNaN(bodyAction) ||
  //   !getBodyData(bodyDirection, bodyAction)
  // )
  //   return null;

  return (
    <ContainerComponent
      pivot={{
        x: -(TILE_SIZE.width + 2) / 2,
        y: -TILE_SIZE.height / 2,
      }}
      zIndex={position.x + position.z + Math.abs(position.y / 100) + 0.5}
      position={getPositionFromIsometricPosition(position)}
      {...containerProps}
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
