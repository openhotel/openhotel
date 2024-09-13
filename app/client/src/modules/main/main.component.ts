import {
  container,
  Event as TulipEvent,
  EventMode,
  global,
  textSprite,
} from "@tu/tulip";
import { System } from "system";
import { Event, SpriteSheetEnum } from "shared/enums";
import { scenesComponent } from "modules/scenes";
import { getVersion, isDevelopment } from "shared/utils";

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
  const $version = textSprite({
    text: isDevelopment() ? "DEVELOPMENT" : `${getVersion()}-alpha`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 4,
      y: 14,
    },
  });
  $textContainer.add($fps, $version);

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
