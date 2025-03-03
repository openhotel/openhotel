import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Env,
  Event,
  EventMode,
  global,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { System } from "system";
import { Size2d } from "shared/types";

export const roomInfoComponent: ContainerComponent = () => {
  const $container = container({
    zIndex: 10,
    eventMode: EventMode.NONE,
    pivot: {
      x: -3,
      y: 3,
    },
  });

  const height = 61 + global.envs.get(Env.SAFE_AREA_INSET_BOTTOM);

  const resize = (size: Size2d) => {
    $container.setPositionY(size.height - height - 2);
  };

  let onRemoveResize;
  $container.on(DisplayObjectEvent.MOUNT, () => {
    resize(global.getApplication().window.getBounds());
    onRemoveResize = global.events.on(Event.RESIZE, resize);

    const room = System.game.rooms.get();
    {
      const $name = textSprite({
        text: `name: ${room.title}`,
        spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
        color: 0xffffff,
        position: {
          x: 4,
          y: 0,
        },
        backgroundPadding: {
          top: 2,
          right: 4,
          bottom: 2,
          left: 4,
        },
        backgroundAlpha: 0.5,
        backgroundColor: 0,
      });
      const $description = textSprite({
        text: `description: ${room.description}`,
        spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
        color: 0xffffff,
        position: {
          x: 4,
          y: $name.getSize().height + 4,
        },
        backgroundPadding: {
          top: 2,
          right: 4,
          bottom: 2,
          left: 4,
        },
        backgroundAlpha: 0.5,
        backgroundColor: 0,
      });
      const $owner = textSprite({
        text: `owner: ${room.ownerUsername}`,
        spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
        color: 0xffffff,
        position: {
          x: 4,
          y: ($name.getSize().height + 4) * 2,
        },
        backgroundPadding: {
          top: 2,
          right: 4,
          bottom: 2,
          left: 4,
        },
        backgroundAlpha: 0.5,
        backgroundColor: 0,
      });
      $container.add($name, $description, $owner);
    }
  });

  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    onRemoveResize?.();
    $container.removeAll();
  });

  return $container.getComponent(roomInfoComponent);
};
