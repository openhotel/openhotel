import {
  container,
  ContainerComponent,
  Event as TulipEvent,
  EventMode,
  global,
  textSprite,
} from "@tu/tulip";
import { Hemisphere, SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";
import { CurrentUser } from "shared/types";

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
  {
    const $coords = textSprite({
      text: "0.0.0",
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0xffffff,
      position: {
        x: 4,
        y: 34,
      },
    });
    System.events.on(SystemEvent.CURSOR_COORDS, ({ position }) => {
      $coords.setText(`${position.x}.${position.y}.${position.z}`);
    });
    $container.add($coords);
  }

  return $container.getComponent(infoComponent);
};
