import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  global,
  scrollableContainer,
  sprite,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";
import { Size2d } from "shared/types";
import { DEFAULT_FURNITURE } from "../../../shared/consts/furniture.consts";

type Props = {
  size: Size2d;
  label: string;
};

export const catalogSectionComponent: ContainerComponent<Props> = (props) => {
  const { size, label } = props;

  const $container = container(props);

  const $text = textSprite({
    text: label.toUpperCase(),
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0,
    position: {
      x: 0,
      y: 0,
    },
  });
  $container.add($text);

  const $loadingText = textSprite({
    text: "Loading...",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0x555555,
    position: {
      x: size.width / 2 - 30,
      y: 15,
    },
  });
  $container.add($loadingText);

  const $furnitureList = scrollableContainer({
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
  $container.add($furnitureList);

  const loadCatalogItems = async () => {
    let currentY = 0;
    const padding = 8;

    const path = `/catalog/${label}`;
    const { catalogFurniture } = await System.api.fetch<{
      catalogFurniture: any;
    }>(path, {});

    await System.game.furniture.loadFurniture(
      ...catalogFurniture.map((furniture) => furniture.id),
    );

    for (const furniture of catalogFurniture) {
      const { id, price } = furniture;

      const furnitureData = System.game.furniture.get(id);

      const textures = Object.keys(
        global.spriteSheets.get(furnitureData.spriteSheet).textures,
      );

      let { texture, bounds } = furnitureData.icon;
      let spriteSheet = furnitureData.spriteSheet;

      if (!textures.includes(texture)) {
        await System.game.furniture.loadFurniture(DEFAULT_FURNITURE);
        const defaultSpriteSheetObject =
          System.game.furniture.get(DEFAULT_FURNITURE);
        texture = defaultSpriteSheetObject.icon.texture;
        bounds = defaultSpriteSheetObject.icon.bounds;
        spriteSheet = defaultSpriteSheetObject.spriteSheet;
      }

      const $furnitureContainer = container({
        size: {
          width: size.width,
          height: bounds.height + padding,
        },
        position: {
          x: 0,
          y: currentY,
        },
        eventMode: EventMode.STATIC,
        cursor: Cursor.POINTER,
      });

      $furnitureList.add($furnitureContainer);

      const $sprite = sprite({
        spriteSheet: spriteSheet,
        texture: texture,
        position: {
          x: 0,
          y: 0,
        },
        bounds: bounds,
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
          x: Math.max(30, bounds.width + 5),
          y: bounds.height / 2 - 2,
        },
        eventMode: EventMode.STATIC,
        cursor: Cursor.POINTER,
      });

      currentY += bounds.height + padding;
      $furnitureContainer.add($sprite);
      $furnitureContainer.add($text);

      $furnitureContainer.on(DisplayObjectEvent.POINTER_TAP, () => {
        System.events.emit(SystemEvent.CHAT_INPUT_APPEND_TEXT, furniture.id);
        return;
      });
    }
    $container.remove($loadingText);
  };

  $container.on(DisplayObjectEvent.ADDED, async () => {
    await loadCatalogItems();
  });

  return $container.getComponent(catalogSectionComponent);
};
