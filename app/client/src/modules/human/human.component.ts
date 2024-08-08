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
  getDirection,
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
  moveTo: (position: Point3d) => Promise<void>;
  cancelMovement: () => void;
  getUser: () => { id: string; username: string };
};

export type HumanMutable = ContainerMutable<{}, Mutable>;

export const humanComponent: ContainerComponent<Props, Mutable> = (props) => {
  const $container = container<Props, Mutable>({
    ...props,
    eventMode: EventMode.STATIC,
    cursor: Cursor.POINTER,
    tint: 0xefcfb1,
    pivot: {
      x: -TILE_SIZE.width / 2,
      y: -TILE_SIZE.height / 2,
    },
  });

  const { user } = $container.getProps();

  let $isometricPosition: Point3d;
  let $direction: Direction = Direction.NORTH;

  //@ts-ignore
  const $isCurrent = System.game.users.getCurrentUser().id === user.id;

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
  $body.getDisplayObject().scale.x = humanData?.xScale ?? 1;
  $container.add($body);

  const head = sprite({
    spriteSheet: SpriteSheetEnum.HUMAN,
    texture: `head_${humanData.directionInitials}`,
    pivot: humanData.head.pivot,
  });
  const torso = sprite({
    spriteSheet: SpriteSheetEnum.HUMAN,
    texture: `torso_${humanData.directionInitials}`,
  });

  const $rerender = () => {
    humanData = System.game.human.get($direction);

    $body.setPivot(humanData.pivot);
    $body.getDisplayObject().scale.x = humanData?.xScale ?? 1;

    head.setTexture(
      `head_${humanData.directionInitials}`,
      SpriteSheetEnum.HUMAN,
    );
    head.setPivot(humanData.head.pivot);

    torso.setTexture(
      `torso_${humanData.directionInitials}`,
      SpriteSheetEnum.HUMAN,
    );
  };
  $rerender();

  $body.add(torso, head);

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
