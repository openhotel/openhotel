import {
  container,
  ContainerComponent,
  EventMode,
  global,
  textSprite,
  Event as TulipEvent,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";

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
      text: `lat ${System.coordinates.getLatitude()}`,
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0xffffff,
      position: {
        x: 4,
        y: 24,
      },
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
