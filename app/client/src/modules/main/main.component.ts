import {
  container,
  Event as TulipEvent,
  EventMode,
  global,
  textSprite,
} from "@tu/tulip";
import { System } from "system";
import { Event, SpriteSheetEnum, SystemEvent } from "shared/enums";
import { scenesComponent } from "modules/scenes";

export const mainComponent = () => {
  const $container = container({
    sortableChildren: true,
  });

  const $pageContainer = container();

  const $textContainer = container({
    zIndex: 10,
    eventMode: EventMode.NONE,
  });
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
  const version = System.version.getVersion();
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
  const $coords = textSprite({
    text: "0.0.0",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 4,
      y: 24,
    },
  });
  System.events.on(SystemEvent.CURSOR_COORDS, ({ position }) => {
    $coords.setText(`${position.x}.${position.y}.${position.z}`);
  });
  $textContainer.add($fps, $version, $coords);

  $container.add($pageContainer, $textContainer);

  let $scene;

  System.proxy.on<any>(Event.WELCOME, async ({ user }) => {
    System.game.users.setCurrentUser(user);

    $scene && $scene.$destroy();

    $scene = scenesComponent();
    $pageContainer.add($scene);
  });

  return $container.getComponent(mainComponent);
};
