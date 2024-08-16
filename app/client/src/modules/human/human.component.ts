import {
  container,
  ContainerComponent,
  ContainerMutable,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  graphics,
  GraphicType,
  sprite,
} from "@tu/tulip";
import {
  getPositionFromIsometricPosition,
  isDirectionToFront,
} from "shared/utils";
import { Point3d, User } from "shared/types";
import {
  Direction,
  Event,
  SpriteSheetEnum,
  SystemEvent,
  TextureEnum,
} from "shared/enums";
import {
  MOVEMENT_BETWEEN_TILES_DURATION,
  TILE_SIZE,
  TILE_WIDTH,
  TILE_Y_HEIGHT,
} from "shared/consts";
import { System } from "system";
import { typingBubbleComponent } from "../chat";
import { TickerQueue } from "@oh/queue";

type Props = {
  user: User;
};

type Mutable = {
  setIsometricPosition: (position: Point3d) => void;
  getIsometricPosition: () => Point3d;
  setBodyDirection: (direction: Direction) => void;
  moveTo: (position: Point3d, direction: Direction) => Promise<void>;
  cancelMovement: () => void;
  getUser: () => { accountId: string; username: string };
};

export type HumanMutable = ContainerMutable<{}, Mutable>;

export const humanComponent: ContainerComponent<Props, Mutable> = (props) => {
  const $container = container<Props, Mutable>({
    ...props,
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
    pivot: {
      x: -TILE_SIZE.width / 2,
      y: -TILE_SIZE.height / 2,
    },
    sortableChildren: true,
  });

  const { user } = $container.getProps();

  let $isometricPosition: Point3d;
  let $direction: Direction = user.bodyDirection;

  const capsule = graphics({
    type: GraphicType.CAPSULE,
    radius: TILE_SIZE.width / 4,
    length: 45,
    angle: 90,
    tint: 0xff00ff,
    zIndex: -1000,
    alpha: 0,
    pivot: {
      x: TILE_SIZE.height + 4,
      y: 0,
    },
  });
  $container.add(capsule);

  let humanData = System.game.human.get($direction);

  const $body = container({
    pivot: humanData.pivot,
  });
  $body.setScaleX(humanData?.xScale ?? 1);
  $container.add($body);

  const head = sprite({
    spriteSheet: SpriteSheetEnum.HUMAN,
    texture: `head_${humanData.directionInitials}`,
    pivot: humanData.head.pivot,
    tint: user.skinColor,
  });
  const torso = sprite({
    spriteSheet: SpriteSheetEnum.HUMAN,
    texture: `torso_${humanData.directionInitials}`,
    tint: user.skinColor,
  });

  const rightArm = sprite({
    spriteSheet: SpriteSheetEnum.HUMAN,
    texture: `arm_right_${humanData.directionInitials}`,
    tint: user.skinColor,
  });

  const leftArm = sprite({
    spriteSheet: SpriteSheetEnum.HUMAN,
    texture: `arm_left_${humanData.directionInitials}`,
    tint: user.skinColor,
  });
  console.log(`arm_left_${humanData.directionInitials}`);

  const $rerender = () => {
    humanData = System.game.human.get($direction);

    $body.setPivot(humanData.pivot);
    $body.setScaleX(humanData?.xScale ?? 1);

    head.setTexture(
      `head_${humanData.directionInitials}`,
      SpriteSheetEnum.HUMAN,
    );
    head.setPivot(humanData.head.pivot);

    torso.setTexture(
      `torso_${humanData.directionInitials}`,
      SpriteSheetEnum.HUMAN,
    );

    rightArm.setVisible(humanData?.rightArm?.visible ?? true);
    rightArm.setTexture(
      `arm_right_${humanData.directionInitials}`,
      SpriteSheetEnum.HUMAN,
    );
    rightArm.setZIndex(humanData?.rightArm?.zIndex ?? 0);
    rightArm.setPivot(humanData?.rightArm?.pivot ?? { x: 0, y: 0 });

    leftArm.setVisible(humanData?.leftArm?.visible ?? true);
    leftArm.setTexture(
      `arm_left_${humanData.directionInitials}`,
      SpriteSheetEnum.HUMAN,
    );
    leftArm.setZIndex(humanData?.leftArm?.zIndex ?? 0);
    leftArm.setPivot(humanData?.leftArm?.pivot ?? { x: 0, y: 0 });
  };
  $rerender();

  $body.add(torso, head, rightArm, leftArm);

  const $typingBubble = typingBubbleComponent({
    position: {
      x: humanData.pivot.x / 2,
      y: -humanData.pivot.y - humanData.head.pivot.y,
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
    removeOnTypingStart = System.proxy.on<{ accountId: string }>(
      Event.TYPING_START,
      ({ accountId }) => {
        if (user.accountId === accountId) $typingBubble.setVisible(true);
      },
    );

    removeOnTypingEnd = System.proxy.on<{ accountId: string }>(
      Event.TYPING_END,
      ({ accountId }) => {
        if (user.accountId === accountId) $typingBubble.setVisible(false);
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
    $calcIsometricPosition();
  };
  const getIsometricPosition = () => $isometricPosition;

  const setBodyDirection = (direction: Direction) => {
    $direction = direction;
    $rerender();
  };

  let lastMovementAnimationId;
  //TODO Move this to a util
  const moveTo = (point: Point3d, direction: Direction) => {
    System.tasks.remove(lastMovementAnimationId);

    let positionXFunc: (x: number) => number = (x) => x;
    let positionYFunc: (y: number) => number = (y) => y;

    let incrementX = 0;
    let incrementZ = 0;
    //@ts-ignore
    let forceZIndex = 0;

    $direction = direction;
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
        // fixes passing below tile
        forceZIndex = 1;
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
        // fixes passing below tile
        forceZIndex = 1;
        break;
    }
    $rerender();

    let repeatIndex = 0;
    const repeatEvery = MOVEMENT_BETWEEN_TILES_DURATION / TILE_WIDTH;

    let targetIsometricPosition = {
      x: $isometricPosition.x + incrementX,
      z: $isometricPosition.z + incrementZ,
      y: point.y,
    };
    const lastY = $isometricPosition.y;
    $isometricPosition = targetIsometricPosition;

    if (isDirectionToFront(direction)) $calcZIndex();

    return new Promise<void>(async (resolve) => {
      lastMovementAnimationId = System.tasks.add({
        type: TickerQueue.REPEAT,
        repeatEvery: repeatEvery,
        repeats: TILE_WIDTH,
        onFunc: () => {
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

  $isometricPosition = user.position;
  $direction = user.bodyDirection;

  $calcIsometricPosition();
  $rerender();

  return $container.getComponent(humanComponent, {
    setIsometricPosition,
    getIsometricPosition,
    setBodyDirection,
    moveTo,
    getUser: () => user,
  });
};
