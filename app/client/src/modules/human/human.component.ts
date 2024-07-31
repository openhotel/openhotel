import {
  container,
  ContainerComponent,
  ContainerMutable,
  DisplayObjectEvent,
  EventMode,
  graphics,
  GraphicType,
  sprite,
  textSprite,
} from "@tulib/tulip";
import {
  getPositionFromIsometricPosition,
  isDirectionToFront,
} from "shared/utils";
import { Point3d, User } from "shared/types";
import { Direction, Event, SpriteSheetEnum, SystemEvent, TextureEnum } from "shared/enums";
import {
  MOVEMENT_BETWEEN_TILES_DURATION,
  TILE_SIZE,
  TILE_WIDTH,
  TILE_Y_HEIGHT,
} from "shared/consts";
import { System } from "../../system";
import { typingBubbleComponent } from "../chat";
import { TickerQueue } from "@oh/queue";
import { getDirection } from "shared/utils/direction.utils";

type Props = {
  user: User;
};

type Mutable = {
  setIsometricPosition: (position: Point3d) => void;
  getIsometricPosition: () => Point3d;
  moveTo: (position: Point3d) => Promise<void>;
  cancelMovement: () => void;
  getUser: () => { id: string; username: string };
};

export type HumanMutable = ContainerMutable<{}, Mutable>;

export const humanComponent: ContainerComponent<Props, Mutable> = ({
  user,
}) => {
  const $container = container<Props, Mutable>();
  $container.setEventMode(EventMode.STATIC);

  //@ts-ignore
  const $isCurrent = System.game.users.getCurrentUser().id === user.id;

  const capsule = graphics({
    type: GraphicType.CAPSULE,
    radius: TILE_SIZE.width / 2,
    length: 30,
    angle: 90,
    tint: 0xff00ff,
    zIndex: -1000,
    alpha: 0.0001,
  });
  capsule.setPivotX(-TILE_SIZE.height);
  const tagName = textSprite({
    text: user.username,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    position: {
      y: -16,
      x: 0,
    },
  });
  tagName.setPivotX(tagName.getBounds().width / 2);
  $container.add(capsule, tagName);

  const human = sprite({
    texture: TextureEnum.HUMAN_DEV,
  });

  human.on(DisplayObjectEvent.LOADED, () => {
    human.setTint(0xefcfb1);

    $container.add(human);
    const bounds = human.getBounds();
    human.setPivotX(Math.round(bounds.width / 2));

    $container.setPivotY(bounds.height - 15);
    $container.setPivotX(-23);
  });

  let $isometricPosition: Point3d;
  //@ts-ignore
  let $direction: Direction;

  const $typingBubble = typingBubbleComponent({
    position: {
      x: 7,
      y: -8,
    },
  });
  $container.add($typingBubble);

  let removeOnTypingStart: () => void;
  let removeOnTypingEnd: () => void;

  $container.on(DisplayObjectEvent.REMOVED, () => {
    removeOnTypingStart?.();
    removeOnTypingEnd?.();
  });
  $container.on(DisplayObjectEvent.ADDED, () => {
    removeOnTypingStart = System.proxy.on<{ userId: string }>(
      Event.TYPING_START,
      ({ userId }) => {
        if (user.id === userId) $typingBubble.setVisible(true);
      },
    );

    removeOnTypingEnd = System.proxy.on<{ userId: string }>(
      Event.TYPING_END,
      ({ userId }) => {
        if (user.id === userId) $typingBubble.setVisible(false);
      },
    );
  });

  $container.add($typingBubble);

  const $calcIsometricPosition = () => {
    $container.setPosition(
      getPositionFromIsometricPosition($isometricPosition),
    );
    $calcZIndex();
  };
  const $calcZIndex = () => {
    $container.setZIndex(
      Math.ceil($isometricPosition.x) +
        Math.ceil($isometricPosition.z) -
        $isometricPosition.y,
    );
  };

  const setIsometricPosition = (position: Point3d) => {
    $isometricPosition = position;
    $isometricPosition.y = System.game.rooms.getYFromPoint(
      $isometricPosition,
      true,
    );
    $calcIsometricPosition();
  };
  const getIsometricPosition = () => $isometricPosition;

  let lastMovementAnimationId;
  //TODO Move this to a util
  const moveTo = (point: Point3d) => {
    System.tasks.remove(lastMovementAnimationId);

    const direction = getDirection(getIsometricPosition(), point);

    let positionXFunc: (x: number) => number = (x) => x;
    let positionYFunc: (y: number) => number = (y) => y;

    let incrementX = 0;
    let incrementZ = 0;
    //@ts-ignore
    let forceZIndex = 0;

    $direction = direction;
    switch (direction) {
      case Direction.NORTH:
        positionXFunc = (x) => x - 2;
        positionYFunc = (y) => y - 1;
        incrementX--;
        break;
      case Direction.NORTH_EAST:
        positionYFunc = (y) => y - 2;
        incrementX -= 1;
        incrementZ -= 1;
        break;
      case Direction.EAST:
        positionXFunc = (x) => x + 2;
        positionYFunc = (y) => y - 1;
        incrementZ--;
        break;
      case Direction.SOUTH_EAST:
        positionXFunc = (x) => x + 4;
        incrementX += 1;
        incrementZ -= 1;
        // fixes passing below tile
        forceZIndex = 1;
        break;
      case Direction.SOUTH:
        positionXFunc = (x) => x + 2;
        positionYFunc = (y) => y + 1;
        incrementX++;
        break;
      case Direction.SOUTH_WEST:
        positionYFunc = (y) => y + 2;
        incrementX += 1;
        incrementZ += 1;
        break;
      case Direction.WEST:
        positionXFunc = (x) => x - 2;
        positionYFunc = (y) => y + 1;
        incrementZ++;
        break;
      case Direction.NORTH_WEST:
        positionXFunc = (x) => x - 4;
        incrementX -= 1;
        incrementZ += 1;
        // fixes passing below tile
        forceZIndex = 1;
        break;
    }

    let repeatIndex = 0;
    const repeatEvery = MOVEMENT_BETWEEN_TILES_DURATION / TILE_WIDTH;

    let targetIsometricPosition = {
      x: $isometricPosition.x + incrementX,
      z: $isometricPosition.z + incrementZ,
      y: 0,
    };
    targetIsometricPosition.y = System.game.rooms.getYFromPoint(
      targetIsometricPosition,
      true,
    );
    const lastY = $isometricPosition.y;
    $isometricPosition = targetIsometricPosition;

    if (isDirectionToFront(direction)) $calcZIndex();

    return new Promise<void>(async (resolve, reject) => {
      lastMovementAnimationId = System.tasks.add({
        type: TickerQueue.REPEAT,
        repeatEvery: repeatEvery,
        repeats: TILE_WIDTH,
        onFunc: (delta) => {
          let targetY = 0;
          //Check if it's at the middle of the index to change to the nex Y
          if (repeatIndex === TILE_WIDTH / 2)
            targetY = targetIsometricPosition.y - lastY;

          $container.setPositionX(positionXFunc);
          $container.setPositionY(
            (y) => positionYFunc(y) - targetY * TILE_Y_HEIGHT,
          );
          repeatIndex++;
        },
        onDone: () => {
          $calcIsometricPosition();
          resolve();
        },
      });
    });
  };

  $container.on(DisplayObjectEvent.POINTER_TAP, () => {
    System.events.emit(SystemEvent.SHOW_PREVIEW, {
      type: "human",
      texture: TextureEnum.HUMAN_DEV,
      name: user.username,
    });
  });

  return $container.getComponent(humanComponent, {
    setIsometricPosition,
    getIsometricPosition,
    moveTo,
    getUser: () => user,
  });
};
