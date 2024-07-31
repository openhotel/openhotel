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
import { SpriteSheetEnum, SystemEvent } from "../../../shared/enums";
import { System } from "../../../system";
import { buttonComponent } from "../../../shared/components";

type Action = {
  name: string;
  icon?: unknown;
  action: () => void;
};

export const previewComponent: ContainerComponent = async () => {
  const $container = await container({
    visible: false,
    zIndex: 1_000,
  });

  const $name = await textSprite({
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

  const $tile = await sprite({
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

  let $sprite = await sprite({
    texture: null,
    eventMode: EventMode.NONE,
    position: {
      x: 15,
      y: 10,
    },
  });

  $container.add($name, $tile, $sprite);

  const $actions = await container();

  // TODO: actions by type
  // Test actions
  const humanActions: Action[] = [
    {
      name: "+ Friend",
      icon: null,
      action: () => console.log("+ Friend"),
    },
    {
      name: "Dance",
      icon: null,
      action: () => console.log("Dance"),
    },
  ];
  const furnitureActions: Action[] = [
    {
      name: "Move",
      icon: null,
      action: () => console.log("move"),
    },
    {
      name: "Rotate",
      icon: null,
      action: () => console.log("Rotate"),
    },
    {
      name: "Pick up",
      icon: null,
      action: () => console.log("Pick up"),
    },
    {
      name: "Use",
      icon: null,
      action: () => console.log("Use"),
    },
  ];

  const $renderButtons = async (actions: Action[]) => {
    $actions.remove(...$actions.getChildren());

    for (let action of actions) {
      const index = actions.indexOf(action);
      const $button = await buttonComponent({
        text: action.name,
        width: 25,
        position: {
          x: 35 - 45 * index,
          y: 125,
        },
        eventMode: EventMode.STATIC,
      });
      $button.on(DisplayObjectEvent.POINTER_TAP, action.action);
      $actions.add($button);
    }
  };

  $container.add($actions);

  let removeOnShowPreview;
  let removeOnHidePreview;

  $container.on(DisplayObjectEvent.ADDED, () => {
    removeOnShowPreview = System.events.on(
      SystemEvent.SHOW_PREVIEW,
      async ({
        type,
        texture,
        name,
      }: {
        type: "furniture" | "human";
        texture: string;
        name: string;
      }) => {
        // if (data?.spriteSheet) await $sprite.setSpriteSheet(data.spriteSheet);
        await $sprite.setTexture(texture);
        await $name.setText(name);

        await $sprite.setTint(type === "human" ? 0xefcfb1 : null);

        await $renderButtons(
          type === "furniture" ? furnitureActions : humanActions,
        );

        await $container.setVisible(true);
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
