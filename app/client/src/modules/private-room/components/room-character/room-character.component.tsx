import React, { useEffect, useMemo, useState } from "react";
import { Point2d, User } from "shared/types";
import { ContainerProps } from "@openhotel/pixi-components";
import {
  getDirection,
  getPositionFromIsometricPosition,
  getZIndex,
  isPosition3dEqual,
} from "shared/utils";
import {
  CharacterArmAction,
  CharacterBodyAction,
  Direction,
} from "shared/enums";
import { CharacterComponent } from "shared/components";
import { usePrivateRoom, useTasks } from "shared/hooks";
import {
  MOVEMENT_BETWEEN_TILES_DURATION,
  SAFE_TILE_ZINDEX_MULTI,
  TILE_WIDTH,
  TILE_Y_HEIGHT,
} from "shared/consts";
import { TickerQueue } from "@oh/queue";

type Props = {
  user: User;
  disableHitArea?: boolean;
} & ContainerProps;

export const RoomCharacterComponent: React.FC<Props> = ({
  user,
  disableHitArea = false,
  ...containerProps
}) => {
  const { setUserPosition } = usePrivateRoom();

  const { add: addTask } = useTasks();

  const [bodyAction, setBodyAction] = useState<CharacterBodyAction>(
    CharacterBodyAction.IDLE,
  );

  const [$position, $setPosition] = useState<Point2d | null>(null);
  const [$zIndex, $setZIndex] = useState<number>(null);

  useEffect(() => {
    if (!user?.targetPosition) return;

    const direction = getDirection(user.position, user.targetPosition);
    if (direction === Direction.NONE) return;
    if (isPosition3dEqual(user.position, user.targetPosition)) return;

    let getPosFunc = (pos: Point2d): Point2d => pos;

    switch (direction) {
      case Direction.NORTH:
        getPosFunc = ({ x, y }) => ({ x: x + 2, y: y + 1 });
        break;
      case Direction.NORTH_EAST:
        getPosFunc = ({ x, y }) => ({ x, y: y + 2 });
        break;
      case Direction.EAST:
        getPosFunc = ({ x, y }) => ({ x: x - 2, y: y + 1 });
        break;
      case Direction.SOUTH_EAST:
        getPosFunc = ({ x, y }) => ({ x: x - 4, y });
        break;
      case Direction.SOUTH:
        getPosFunc = ({ x, y }) => ({ x: x - 2, y: y - 1 });
        break;
      case Direction.SOUTH_WEST:
        getPosFunc = ({ x, y }) => ({ x, y: y - 2 });
        break;
      case Direction.WEST:
        getPosFunc = ({ x, y }) => ({ x: x + 2, y: y - 1 });
        break;
      case Direction.NORTH_WEST:
        getPosFunc = ({ x, y }) => ({ x: x + 4, y });
        break;
    }
    const repeatEvery = MOVEMENT_BETWEEN_TILES_DURATION / TILE_WIDTH;
    const $currentPosition = getPositionFromIsometricPosition(user.position);
    let repeatIndex = 0;

    const currentZIndex = getZIndex(user.position, 0.5);
    const targetZIndex = getZIndex(user.targetPosition, 0.5);

    if (targetZIndex === currentZIndex)
      $setZIndex(currentZIndex + SAFE_TILE_ZINDEX_MULTI);

    const removeTask = addTask({
      type: TickerQueue.REPEAT,
      repeatEvery: repeatEvery,
      repeats: TILE_WIDTH,
      onFunc: () => {
        let targetY = 0;
        //Check if it's at the middle of the index to change to the nex Y
        if (repeatIndex === TILE_WIDTH / 2)
          targetY = user.position.y - user.targetPosition.y;

        const goBack =
          targetZIndex < currentZIndex && repeatIndex - 4 === TILE_WIDTH / 2;
        const goFront =
          targetZIndex > currentZIndex && repeatIndex + 4 === TILE_WIDTH / 2;
        if (goBack || goFront) $setZIndex(targetZIndex);

        //TODO <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        if (repeatIndex % 2)
          setBodyAction((action) => {
            action++;
            if (CharacterBodyAction.WALK_0 > action)
              action = CharacterBodyAction.WALK_0;

            if (action > CharacterBodyAction.WALK_3)
              action = CharacterBodyAction.WALK_0;
            return action;
          });
        //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        $setPosition((pos) => {
          const { x, y } = getPosFunc({
            x: pos?.x ?? $currentPosition?.x,
            y: pos?.y ?? $currentPosition?.y,
          });
          return {
            x,
            y: y + targetY * TILE_Y_HEIGHT,
          };
        });
        repeatIndex++;
      },
      onDone: () => {
        $setPosition(null);
        $setZIndex(null);
        setBodyAction(CharacterBodyAction.IDLE);
        setUserPosition(user.accountId, user.targetPosition);
      },
    });
    return () => {
      $setPosition(null);
      $setZIndex(null);
      removeTask();
    };
  }, [
    user.position,
    user.targetPosition,
    $setPosition,
    $setZIndex,
    addTask,
    setUserPosition,
    setBodyAction,
  ]);

  const position = useMemo(
    () => $position ?? getPositionFromIsometricPosition(user.position),
    [$position, user.position],
  );

  const zIndex = useMemo(
    () => $zIndex ?? getZIndex(user.position, 0.5),
    [$zIndex, user.position],
  );

  return useMemo(
    () => (
      <CharacterComponent
        bodyAction={bodyAction}
        bodyDirection={user.bodyDirection}
        headDirection={user.bodyDirection}
        leftArmAction={CharacterArmAction.IDLE}
        rightArmAction={CharacterArmAction.IDLE}
        skinColor={user.skinColor ?? 0xefcfb1}
        position={position}
        zIndex={zIndex}
        disableHitArea={disableHitArea}
        {...containerProps}
      />
    ),
    [bodyAction, user, position, zIndex, containerProps, disableHitArea],
  );
};
