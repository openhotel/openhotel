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
import { getPositionFromIsometricPosition } from "shared/utils";
import { Point3d, User } from "shared/types";
import { Direction, Event, SpriteSheetEnum } from "shared/enums";
import {
  MOVEMENT_BETWEEN_TILES_DURATION,
  TILE_SIZE,
  TILE_WIDTH,
  TILE_Y_HEIGHT,
} from "shared/consts";
import { System } from "../../system";
import { typingBubbleComponent } from "../chat";
import { TextureEnum } from "shared/enums/texture.enum";
import { TickerQueue } from "@oh/queue";

type Props = {
  user: User;
};

type Mutable = {
  setIsometricPosition: (position: Point3d) => Promise<void>;
  getIsometricPosition: () => Point3d;
  moveTo: (direction: Direction) => Promise<void>;
  cancelMovement: () => void;
  getUser: () => { id: string; username: string };
};

export type HumanMutable = ContainerMutable<{}, Mutable>;

export const humanComponent: ContainerComponent<Props, Mutable> = async ({
  user,
}) => {
  const $container = await container<Props, Mutable>();
  await $container.setEventMode(EventMode.NONE);

  const $isCurrent = System.game.users.getCurrentUser().id === user.id;

  const capsule = await graphics({
    type: GraphicType.CAPSULE,
    radius: TILE_SIZE.width / 2,
    length: 30,
    angle: 90,
    tint: 0xff00ff,
    zIndex: -1000,
    alpha: 0.0001,
  });
  await capsule.setPivotX(-TILE_SIZE.height);
  const tagName = await textSprite({
    text: user.username,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    position: {
      y: -16,
      x: 0,
    },
  });
  await tagName.setPivotX(tagName.getBounds().width / 2);
  $container.add(capsule, tagName);

  const human = await sprite({
    texture: TextureEnum.HUMAN_DEV,
  });
  await human.setTint(0xefcfb1);

  $container.add(human);
  const bounds = human.getBounds();
  await human.setPivotX(Math.round(bounds.width / 2));

  await $container.setPivotY(bounds.height - 15);
  await $container.setPivotX(-23);

  let $isometricPosition: Point3d;
  let $direction: Direction;

  const $typingBubble = await typingBubbleComponent({
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
  $container.on(DisplayObjectEvent.ADDED, async () => {
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

  const setIsometricPosition = async (position: Point3d) => {
    $isometricPosition = position;

    $isometricPosition.y = System.game.rooms.getYFromPoint(
      $isometricPosition,
      true,
    );
    await $container.setPosition(
      getPositionFromIsometricPosition($isometricPosition),
    );
    await $container.setZIndex(
      Math.ceil($isometricPosition.x) +
        Math.ceil($isometricPosition.z) -
        $isometricPosition.y,
    );
  };

  let lastMovementAnimationId;
  //TODO Move this to a util
  const moveTo = async (direction: Direction) => {
    return new Promise<void>(async (resolve, reject) => {
      let positionXFunc: (x: number) => number = (x) => x;
      let positionYFunc: (y: number) => number = (y) => y;

      let incrementX = 0;
      let incrementZ = 0;
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
        default:
          return resolve();
      }

      const position = {
        ...$isometricPosition,
        x: $isometricPosition.x + incrementX,
        z: $isometricPosition.z + incrementZ,
      };

      await setIsometricPosition(position);

      let repeatIndex = 0;
      const repeatEvery = MOVEMENT_BETWEEN_TILES_DURATION / TILE_WIDTH;

      //Check if animation is rejected

      let accDelta = 0;
      let a = performance.now();
      lastMovementAnimationId = System.tasks.add({
        type: TickerQueue.DURATION,
        duration: MOVEMENT_BETWEEN_TILES_DURATION,
        onFunc: (delta) => {
          accDelta += delta;

          if (accDelta < repeatEvery) return;
          accDelta -= repeatEvery;

          $container.setPositionX(positionXFunc);

          let targetY = 0;
          //Check if it's at the middle of the index to change to the nex Y
          if (repeatIndex === TILE_WIDTH / 2) {
            targetY =
              System.game.rooms.getYFromPoint(
                {
                  x: $isometricPosition.x + incrementX,
                  z: $isometricPosition.z + incrementZ,
                },
                true,
              ) - $isometricPosition.y;
          }
          $container.setPositionY(
            (y) => positionYFunc(y) - targetY * TILE_Y_HEIGHT,
          );

          repeatIndex++;
        },
        onDone: async () => {
          console.log(performance.now() - a, accDelta);
          resolve();
        },
      });
    });
  };

  const cancelMovement = () => {
    console.log("cancelMovement");
    System.tasks.remove(lastMovementAnimationId);
    lastMovementAnimationId = null;
  };

  return $container.getComponent(humanComponent, {
    setIsometricPosition,
    getIsometricPosition: () => $isometricPosition,
    moveTo,
    cancelMovement,
    getUser: () => user,
  });
};
