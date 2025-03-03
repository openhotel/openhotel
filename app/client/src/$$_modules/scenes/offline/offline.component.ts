import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event,
  EventMode,
  global,
  graphics,
  GraphicType,
  Size,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum, SystemEvent } from "shared/enums";
import { buttonComponent } from "shared/components";
import { __ } from "shared/utils";
import { System } from "system";

export const offlineComponent: ContainerComponent = () => {
  const $container = container({
    zIndex: 10,
    visible: false,
  });

  const $background = graphics({
    type: GraphicType.RECTANGLE,
    width: 0,
    height: 0,
    tint: 0,
    alpha: 0.75,
    eventMode: EventMode.STATIC,
    withContext: true,
  });
  $container.add($background);
  $background.focus();

  const { width, height } = global.getApplication().window.getBounds();
  $background.setRectangle(width, height);

  const $card = container({
    position: {
      x: width / 2,
      y: height / 2 - 55,
    },
  });
  $container.add($card);

  const $title = textSprite({
    text: __("You have been disconnected from the server!"),
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 0,
      y: 0,
    },
  });
  $title.setPivotX($title.getBounds().width / 2);

  const $button = buttonComponent({
    text: __("Return to the hotel"),
    width: 100,
    position: {
      x: 0,
      y: 20,
    },
    eventMode: EventMode.STATIC,
  });
  $button.setPivotX($button.getBounds().width / 2);

  $button.on(DisplayObjectEvent.POINTER_TAP, async () => {
    window.location.reload();
  });

  $card.add($button, $title);

  const $resize = (size: Size) => {
    const { width, height } = size;

    const cardBounds = $card.getBounds();
    $background.setRectangle(width, height);
    $card.setPosition({
      x: size.width / 2,
      y: size.height / 2 - cardBounds.height / 2,
    });
  };

  let $removeOnResize;
  const $destroyVisibility = $container.on(
    DisplayObjectEvent.VISIBILITY_CHANGE,
    ({ visible }) => {
      if (!visible) return;

      $resize(global.getApplication().window.getBounds());
      $removeOnResize = global.events.on(Event.RESIZE, $resize);
      System.events.emit(SystemEvent.HIDE_MODALS);
    },
  );

  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    $removeOnResize();
    $destroyVisibility();
  });

  return $container.getComponent(offlineComponent);
};
