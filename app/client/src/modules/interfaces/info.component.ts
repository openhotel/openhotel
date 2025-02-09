import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event as TulipEvent,
  EventMode,
  global,
  HorizontalAlign,
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
import { TextSpriteMutable } from "@tu/tulip/_dist";

export const infoComponent: ContainerComponent = () => {
  const $container = container({
    zIndex: 10,
    eventMode: EventMode.NONE,
    pivot: {
      y: -4,
      x: -4,
    },
    visible: localStorage.getItem("info") === "1",
  });

  const textSpriteConfig = {
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    horizontalAlign: HorizontalAlign.RIGHT,
    backgroundPadding: {
      top: 2,
      right: 4,
      bottom: 2,
      left: 4,
    },
    backgroundAlpha: 0.5,
    backgroundColor: 0,
  };

  const $fps = textSprite({
    text: `0 FPS`,
    position: {
      x: 0,
      y: 4,
    },
    ...textSpriteConfig,
  });
  global.events.on(TulipEvent.FPS, ({ fps }) => {
    $fps.setText(`${fps} FPS`);
    $reload();
  });
  $container.add($fps);
  //--------------------------------------

  const isDevelopment = System.config.isDevelopment();
  const $version = textSprite({
    text: isDevelopment ? "development" : `${System.config.getVersion()}-alpha`,
    position: {
      x: 0,
      y: 15,
    },
    ...textSpriteConfig,
  });
  $container.add($version);
  //--------------------------------------

  const $hem = textSprite({
    text: `hem null`,
    position: {
      x: 0,
      y: 26,
    },
    ...textSpriteConfig,
  });
  System.events.on(SystemEvent.CURRENT_USER_SET, (user: CurrentUser) => {
    $hem.setText(`hem ${Hemisphere[user.hemisphere]}`);
    $reload();
  });
  $container.add($hem);
  //--------------------------------------

  const $coords = textSprite({
    text: "null",
    position: {
      x: 0,
      y: 37,
    },
    ...textSpriteConfig,
  });
  let $humanPosition: Point3d = { x: 0, y: 0, z: 0 };
  System.events.on(SystemEvent.CURSOR_COORDS, ({ position }) => {
    const cursorDirection = getDirection($humanPosition, position);
    const crossDirection = getCrossDirectionFromDirection(cursorDirection);

    $coords.setText(
      `cursor: ${position.x}.${position.y}.${position.z} - ${Direction[cursorDirection]} (${cursorDirection}) ${CrossDirection[crossDirection]} (${crossDirection})`,
    );
    $reload();
  });
  $container.add($coords);
  //--------------------------------------

  const $direction = textSprite({
    text: "null",
    position: {
      x: 0,
      y: 48,
    },
    ...textSpriteConfig,
  });

  $container.add($direction);
  //--------------------------------------

  const $test = textSprite({
    text: "null",
    position: {
      x: 0,
      y: 59,
    },
    visible: isDevelopment,
    ...textSpriteConfig,
  });

  $container.add($test);

  const setDirectionText = (position: Point3d, direction: Direction) => {
    const crossDirection = getCrossDirectionFromDirection(direction);

    $humanPosition = position;
    $direction.setText(
      `human: ${position.x}.${position.y}.${position.z} - ${Direction[direction]} (${direction}) ${CrossDirection[crossDirection]} (${crossDirection})`,
    );
    $reload();
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
    $reload();
  });

  const $reload = () => {
    $container.setPivotX(-global.getApplication().window.getBounds().width + 4);
    for (const $child of $container.getChildren() as TextSpriteMutable[])
      $child.setPivotX($child.getBounds().width);
  };

  $reload();
  global.events.on(TulipEvent.RESIZE, () => {
    $reload();
  });

  global.events.on(TulipEvent.KEY_UP, ({ key }: KeyboardEvent) => {
    if (key === "F1") {
      const isEnabled = localStorage.getItem("info") === "1";
      localStorage.setItem("info", isEnabled ? "0" : "1");
      $container.setVisible(!isEnabled);
    }
  });

  $container.on(DisplayObjectEvent.MOUNT, () => {
    System.events.on(SystemEvent.TEST, (text) => {
      $test.setText(text);
      $reload();
    });
  });

  return $container.getComponent(infoComponent);
};
