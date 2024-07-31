import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  EventMode,
  HorizontalAlign,
  sprite,
  textSprite,
  VerticalAlign,
} from "@tulib/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { System } from "system";
import { buttonComponent } from "shared/components";
import { Preview, PreviewAction } from "shared/types";
import { PREVIEW_ACTIONS } from "shared/consts";

export const previewComponent: ContainerComponent = (props) => {
  const $container = container({
    visible: false,
    zIndex: 1_000,
    ...props,
  });

  const $name = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: "",
    verticalAlign: VerticalAlign.MIDDLE,
    horizontalAlign: HorizontalAlign.CENTER,
    size: {
      width: 50,
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
    position: {
      x: 0,
      y: 100,
    },
  });

  const $tile = sprite({
    spriteSheet: SpriteSheetEnum.ROOM,
    texture: "tile",
    eventMode: EventMode.NONE,
    pivot: {
      x: -2,
      y: 0,
    },
    position: {
      x: 0,
      y: 60,
    },
    tint: 0x1e1e1e,
  });

  let $sprite = sprite({
    texture: null,
    eventMode: EventMode.NONE,
    position: {
      x: 15,
      y: 10,
    },
  });

  $container.add($name, $tile, $sprite);

  const $actions = container();

  const $renderButtons = (actions: PreviewAction[]) => {
    $actions.remove(...$actions.getChildren());

    $actions.add(
      ...actions.map((action, index) => {
        const $button = buttonComponent({
          text: action.name,
          width: 25,
          position: {
            x: 35 - 45 * index,
            y: 125,
          },
          eventMode: EventMode.STATIC,
        });
        $button.on(DisplayObjectEvent.POINTER_TAP, action.action);
        return $button;
      }),
    );
  };

  $container.add($actions);

  let removeOnShowPreview;
  let removeOnHidePreview;

  $container.on(DisplayObjectEvent.ADDED, () => {
    removeOnShowPreview = System.events.on(
      SystemEvent.SHOW_PREVIEW,
      async ({ type, texture, spriteSheet, name }: Preview) => {
        if (spriteSheet) await $sprite.setSpriteSheet(spriteSheet);
        await $sprite.setTexture(texture);
        $name.setText(name);

        $sprite.setTint(type === "human" ? 0xefcfb1 : null);

        $renderButtons(PREVIEW_ACTIONS[type]);

        $container.setVisible(true);
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
