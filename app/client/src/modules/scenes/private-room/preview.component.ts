import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
  sprite,
  textSprite,
  VerticalAlign,
} from "@tu/tulip";
import { FurnitureType, SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";
import { Preview } from "shared/types";
import { previewHumanComponent } from "modules/human";
import {
  previewFurnitureComponent,
  previewFurnitureFrameComponent,
} from "modules/scenes/private-room/furniture";

export const previewComponent: ContainerComponent = (props) => {
  const $container = container({
    visible: false,
    zIndex: 1_000,
    pivot: {
      x: 8,
      y: -70,
    },
    ...props,
  });

  const $name = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: "",
    verticalAlign: VerticalAlign.MIDDLE,
    horizontalAlign: HorizontalAlign.CENTER,
    size: {
      width: 100,
      height: 10,
    },
    backgroundPadding: {
      top: 2,
      left: 2,
      bottom: 2,
      right: 2,
    },
    backgroundColor: 0x1e1e1e,
    backgroundAlpha: 0.7,
    pivot: {
      x: 25,
      y: 0,
    },
    position: {
      x: 0,
      y: 40,
    },
  });
  $container.add($name);

  const $tile = sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: "tile",
    eventMode: EventMode.NONE,
    pivot: {
      x: 0,
      y: 0,
    },
    tint: 0xcccccc,
  });

  $container.add($tile);

  let removeOnShowPreview;
  let removeOnHidePreview;

  let lastContainerPreview;

  $container.on(DisplayObjectEvent.ADDED, () => {
    removeOnShowPreview = System.events.on(
      SystemEvent.SHOW_PREVIEW,
      async ({ type, user, furniture }: Preview) => {
        lastContainerPreview && $container.remove(lastContainerPreview);
        lastContainerPreview = null;

        switch (type) {
          case "furniture":
            switch (furniture.type) {
              case FurnitureType.FRAME:
                lastContainerPreview = previewFurnitureFrameComponent({
                  furniture,
                });
                break;
              case FurnitureType.FURNITURE:
              case FurnitureType.TELEPORT:
                lastContainerPreview = previewFurnitureComponent({
                  furniture,
                });
                break;
            }

            const furnitureData = System.game.furniture.get(
              furniture.furnitureId,
            );

            $name.setText(furnitureData.label ?? furniture.furnitureId);
            break;
          case "human":
            lastContainerPreview = previewHumanComponent({
              user,
            });
            $name.setText(user.username);
            break;
        }

        if (lastContainerPreview) {
          $container.add(lastContainerPreview);
          $container.setVisible(true);
        }

        // $sprite.setTexture(texture, spriteSheet);
        // $name.setText(name);
        //
        // $sprite.setTint(type === "human" ? 0xefcfb1 : null);
        //
        // $renderButtons(PREVIEW_ACTIONS[type]);
        //
        // $container.setVisible(true);
      },
    );

    removeOnHidePreview = System.events.on(SystemEvent.HIDE_PREVIEW, () =>
      $container.setVisible(false),
    );
  });

  $container.on(DisplayObjectEvent.DESTROYED, () => {
    removeOnShowPreview?.();
    removeOnHidePreview?.();
  });

  return $container.getComponent(previewComponent);
};
