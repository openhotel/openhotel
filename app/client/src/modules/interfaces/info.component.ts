import {
  container,
  ContainerComponent,
  Event as TulipEvent,
  EventMode,
  global,
  textSprite,
} from "@tu/tulip";
import {
  CrossDirection,
  Direction,
  Event,
  Hemisphere,
  SpriteSheetEnum,
  SystemEvent,
} from "shared/enums";
import { System } from "system";
import { CurrentUser, Point3d } from "shared/types";
import { getCrossDirectionFromDirection, getDirection } from "shared/utils";

export const infoComponent: ContainerComponent = () => {
  const $container = container({
    zIndex: 10,
    eventMode: EventMode.NONE,
  });

  {
    const $fps = textSprite({
      text: `0 FPS`,
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0xffffff,
      position: {
        x: 4,
        y: 4,
      },
    });
    global.events.on(TulipEvent.FPS, ({ fps }) => {
      $fps.setText(`${fps} FPS`);
    });
    $container.add($fps);
  }
  {
    const isDevelopment = System.version.isDevelopment();
    const $version = textSprite({
      text: isDevelopment
        ? "development"
        : `${System.version.getVersion()}-alpha`,
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0xffffff,
      position: {
        x: 4,
        y: 14,
      },
    });
    $container.add($version);
  }
  {
    const $coords = textSprite({
      text: `hem null`,
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0xffffff,
      position: {
        x: 4,
        y: 24,
      },
    });
    System.events.on(SystemEvent.CURRENT_USER_SET, (user: CurrentUser) => {
      $coords.setText(`hem ${Hemisphere[user.hemisphere]}`);
    });
    $container.add($coords);
  }
  const $coords = textSprite({
    text: "null",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 4,
      y: 34,
    },
  });
  let $humanPosition: Point3d = { x: 0, y: 0, z: 0 };
  System.events.on(SystemEvent.CURSOR_COORDS, ({ position }) => {
    const cursorDirection = getDirection($humanPosition, position);
    const crossDirection = getCrossDirectionFromDirection(cursorDirection);

    $coords.setText(
      `cursor: ${position.x}.${position.y}.${position.z} - ${Direction[cursorDirection]} (${cursorDirection}) ${CrossDirection[crossDirection]} (${crossDirection})`,
    );
  });
  $container.add($coords);

  //--------------------------------------
  const $direction = textSprite({
    text: "null",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 4,
      y: 44,
    },
  });

  const setDirectionText = (position: Point3d, direction: Direction) => {
    const crossDirection = getCrossDirectionFromDirection(direction);

    $humanPosition = position;
    $direction.setText(
      `human: ${position.x}.${position.y}.${position.z} - ${Direction[direction]} (${direction}) ${CrossDirection[crossDirection]} (${crossDirection})`,
    );
  };

  const getCurrentAccountId = () =>
    System.game.users.getCurrentUser()?.accountId;

  System.proxy.on<any>(
    Event.MOVE_HUMAN,
    ({ accountId, bodyDirection, position }) => {
      if (getCurrentAccountId() !== accountId) return;

      setDirectionText(position, bodyDirection);
    },
  );

  System.proxy.on<any>(
    Event.ADD_HUMAN,
    ({ user: { accountId, bodyDirection, position } }) => {
      if (getCurrentAccountId() !== accountId) return;

      setDirectionText(position, bodyDirection);
    },
  );

  System.proxy.on<any>(Event.LEAVE_ROOM, () => {
    $direction.setText(`null`);
    $coords.setText(`null`);
  });

  $container.add($direction);

  return $container.getComponent(infoComponent);
};
