import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  scrollableContainer,
  sprite,
  textSprite,
} from "@tu/tulip";
import {SpriteSheetEnum, SystemEvent} from "shared/enums";
import { System } from "system";
import { Size2d } from "shared/types";

type Props = {
  size: Size2d;
  furnitures;
};

export const allFurnituresComponent: ContainerComponent<Props> = (props) => {
  const $container = container(props);

  const $text = textSprite({
    text: `ALL`,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0,
    position: {
      x: 0,
      y: 0,
    },
  });
  $container.add($text);

  const { size, furnitures } = $container.getProps();

  const $spriteList = scrollableContainer({
    position: {
      x: 0,
      y: 10,
    },
    size: {
      width: size.width - 10,
      height: size.height - 10,
    },
    jump: 3,
    verticalScroll: true,
    horizontalScroll: false,
    components: [
      sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "selector-arrow",
        metadata: "scroll-button-top",
      }),
      sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "selector",
        metadata: "scroll-selector-y",
      }),
      sprite({
        spriteSheet: SpriteSheetEnum.UI,
        texture: "selector-arrow",
        metadata: "scroll-button-bottom",
        scale: {
          y: -1,
          x: 1,
        },
        pivot: {
          x: 0,
          y: 9,
        },
      }),
    ],
  });
  $container.add($spriteList);

  const loadFurnitures = async () => {
    let currentY = 0;
    const padding = 8;

    for (const furniture of furnitures) {
      if (!System.game.furniture.isLoaded(furniture.id))
        await System.game.furniture.loadFurniture(furniture.id);

      const spriteSheet = System.api.getPath(
        `/furniture/sheet.json?furnitureId=${furniture.id}`,
      );
      const furnitureData = await fetch(
        System.api.getPath(`/furniture?furnitureId=${furniture.id}`),
      ).then((data) => data.json());

      const iconTexture = furnitureData.icon.texture;
      const iconBounds = furnitureData.icon.bounds;

      const $spriteContainer = container({
        size: {
          width: size.width,
          height: iconBounds.height + padding,
        },
        position: {
          x: 0,
          y: currentY,
        },
        eventMode: EventMode.STATIC,
        cursor: Cursor.POINTER,
      });

      $spriteList.add($spriteContainer);
      const $sprite = sprite({
        spriteSheet: spriteSheet,
        texture: iconTexture,
        position: {
          x: 0,
          y: 0,
        },
        bounds: iconBounds,
        pivot: {
          x: 0,
          y: 0,
        },
        eventMode: EventMode.STATIC,
        cursor: Cursor.POINTER,
      });

      const $text = textSprite({
        text: furniture.id,
        spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
        color: 0,
        position: {
          x: Math.max(30, iconBounds.width + 5),
          y:  iconBounds.height / 2 - 2,
        },
        eventMode: EventMode.STATIC,
        cursor: Cursor.POINTER,
      });

      currentY += iconBounds.height + padding;
      $spriteContainer.add($sprite);
      $spriteContainer.add($text);

      $spriteContainer.on(DisplayObjectEvent.POINTER_TAP, (event: MouseEvent) => {
        System.events.emit(SystemEvent.CHAT_INPUT_APPEND_TEXT, furniture.id);
        return;
      });
    }
  };

  $container.on(DisplayObjectEvent.MOUNT, async () => {
    await loadFurnitures();
  });

  return $container.getComponent(allFurnituresComponent);
};
