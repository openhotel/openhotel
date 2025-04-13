import React, { useEffect, useMemo, useState } from "react";
import {
  ContainerComponent,
  ContainerProps,
  Cursor,
  EventMode,
  GraphicsComponent,
  GraphicType,
} from "@openhotel/pixi-components";
import {
  CharacterArmAction,
  CharacterArmSide,
  CharacterBodyAction,
  Direction,
} from "shared/enums";
import {
  MOVEMENT_BETWEEN_TILES_DURATION,
  SAFE_Z_INDEX,
  TILE_SIZE,
  TILE_WIDTH,
  TILE_Y_HEIGHT,
} from "shared/consts";
import { ArmComponent, BodyComponent, HeadComponent } from "./components";
import { Point2d, User } from "shared/types";
import {
  getDirection,
  getPositionFromIsometricPosition,
  getZIndex,
} from "shared/utils";
import { getCubePolygon } from "shared/utils/polygon.utils";
import { useTasks } from "shared/hooks";
import { TickerQueue } from "@oh/queue";

type Props = {
  user: User;
} & ContainerProps;

export const CharacterComponent: React.FC<Props> = ({
  user,
  ...containerProps
}) => {
  const { add: addTask } = useTasks();

  const [$position, $setPosition] = useState<Point2d | null>(null);
  const [bodyAction, setBodyAction] = useState<CharacterBodyAction>(
    CharacterBodyAction.IDLE,
  );

  useEffect(() => {
    if (!user?.targetPosition) return;

    const currentPosition = user.position;
    const targetPosition = user.targetPosition;

    const direction = getDirection(user.position, user.targetPosition);

    if (direction === Direction.NONE) return;

    let positionXFunc: (x: number) => number = (x) => x;
    let positionYFunc: (y: number) => number = (y) => y;

    let incrementX = 0;
    let incrementZ = 0;

    switch (direction) {
      case Direction.NORTH:
        positionXFunc = (x) => x + 2;
        positionYFunc = (y) => y + 1;
        incrementX++;
        break;
      case Direction.NORTH_EAST:
        positionYFunc = (y) => y + 2;
        incrementX += 1;
        incrementZ += 1;
        break;
      case Direction.EAST:
        positionXFunc = (x) => x - 2;
        positionYFunc = (y) => y + 1;
        incrementZ++;
        break;
      case Direction.SOUTH_EAST:
        positionXFunc = (x) => x - 4;
        incrementX -= 1;
        incrementZ += 1;
        break;
      case Direction.SOUTH:
        positionXFunc = (x) => x - 2;
        positionYFunc = (y) => y - 1;
        incrementX--;
        break;
      case Direction.SOUTH_WEST:
        positionYFunc = (y) => y - 2;
        incrementX -= 1;
        incrementZ -= 1;
        break;
      case Direction.WEST:
        positionXFunc = (x) => x + 2;
        positionYFunc = (y) => y - 1;
        incrementZ--;
        break;
      case Direction.NORTH_WEST:
        positionXFunc = (x) => x + 4;
        incrementX += 1;
        incrementZ -= 1;
        break;
    }

    // $setPosition(null);

    const repeatEvery = MOVEMENT_BETWEEN_TILES_DURATION / TILE_WIDTH;

    const targetIsometricPosition = {
      x: currentPosition.x + incrementX,
      z: currentPosition.z + incrementZ,
      y: targetPosition.y,
    };

    const $currentPosition = getPositionFromIsometricPosition(user.position);

    const removeTask = addTask({
      type: TickerQueue.REPEAT,
      repeatEvery: repeatEvery,
      repeats: TILE_WIDTH,
      onFunc: () => {
        let targetY = 0;
        //Check if it's at the middle of the index to change to the nex Y
        // if (repeatIndex === TILE_WIDTH / 2)
        //   targetY = targetIsometricPosition.y - lastY;

        $setPosition((pos) => ({
          x: positionXFunc(pos?.x ?? $currentPosition?.x),
          y:
            positionYFunc(pos?.y ?? $currentPosition?.y) -
            targetY * TILE_Y_HEIGHT,
        }));
        // $container.setPositionX(positionXFunc);
        // $container.setPositionY(
        //   (y) => positionYFunc(y) - targetY * TILE_Y_HEIGHT,
        // );
        // repeatIndex++;
      },
      onDone: () => {
        console.log("done");
        $setPosition(null);
      },
    });
    return () => {
      console.log("removeTask");
    };
  }, [user, $setPosition, addTask]);

  const position = useMemo(
    () => $position ?? getPositionFromIsometricPosition(user.position),
    [user.position, $position],
  );
  const zIndex = useMemo(() => getZIndex(user.position), [user.position]);

  console.log(position);
  return (
    <CharacterWrapperComponent
      bodyAction={bodyAction}
      bodyDirection={user.bodyDirection}
      headDirection={user.bodyDirection}
      leftArmAction={CharacterArmAction.IDLE}
      rightArmAction={CharacterArmAction.IDLE}
      skinColor={user.skinColor ?? 0xefcfb1}
      // @ts-ignore
      position={position}
      zIndex={zIndex}
      {...containerProps}
    />
  );
};

type WrapperProps = {
  bodyAction: CharacterBodyAction;
  bodyDirection: Direction;
  headDirection: Direction;
  leftArmAction: CharacterArmAction;
  rightArmAction: CharacterArmAction;
  skinColor: number;

  speaking?: boolean;
} & ContainerProps;

export const CharacterWrapperComponent: React.FC<WrapperProps> = ({
  bodyAction,
  bodyDirection,
  headDirection,
  leftArmAction,
  rightArmAction,
  skinColor,

  speaking = false,

  position,
  zIndex,

  onPointerDown,
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

  // const $zIndex = useMemo(
  //   () => position.x + position.z + Math.abs(position.y / 100) + 1,
  //   [position],
  // );
  const $pivot = useMemo(
    () => ({
      x: -(TILE_SIZE.width + 2) / 2,
      y: -TILE_SIZE.height / 2,
    }),
    [],
  );
  // const $position = useMemo(
  //   () => getPositionFromIsometricPosition(position),
  //   [position],
  // );

  return (
    <React.Fragment>
      <GraphicsComponent
        type={GraphicType.POLYGON}
        tint={0x00ffff}
        alpha={0}
        polygon={getCubePolygon({ width: 26, height: 65 })}
        eventMode={EventMode.STATIC}
        cursor={Cursor.CROSSHAIR}
        zIndex={SAFE_Z_INDEX + zIndex}
        position={position}
        pivot={{
          x: -11,
          y: -6,
        }}
        onPointerDown={onPointerDown}
      />
      <ContainerComponent
        pivot={$pivot}
        zIndex={zIndex}
        position={position}
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
          {/*<BubbleActionComponent*/}
          {/*  pivot={{*/}
          {/*    x: 0,*/}
          {/*    y: 15,*/}
          {/*  }}*/}
          {/*  scale={{ x: -1 }}*/}
          {/*  text="..."*/}
          {/*  zIndex={100}*/}
          {/*  padding={{*/}
          {/*    top: 0,*/}
          {/*    right: 3,*/}
          {/*    left: 3,*/}
          {/*    bottom: 3,*/}
          {/*  }}*/}
          {/*/>*/}
        </BodyComponent>
      </ContainerComponent>
    </React.Fragment>
  );
};
