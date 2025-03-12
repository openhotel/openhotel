import React from "react";
import { ContainerComponent } from "@oh/pixi-components";
import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  CharacterBodyAnimation,
  Direction,
} from "shared/enums";
import { TILE_SIZE } from "shared/consts";
import { ArmComponent, BodyComponent, HeadComponent } from "./components";

type Props = {
  bodyAnimation: CharacterBodyAnimation;
  bodyDirection: Direction;
  headDirection: Direction;
  leftArmAction: CharacterArmAction;
  rightArmAction: CharacterArmAction;
  skinColor: number;
};

export const CharacterComponent: React.FC<Props> = ({
  bodyAnimation,
  bodyDirection,
  headDirection,
  leftArmAction,
  rightArmAction,
  skinColor,
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

  const bodyAction = CharacterBodyAction.SIT;

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
