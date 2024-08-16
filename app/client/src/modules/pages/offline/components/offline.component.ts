import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event,
  EventMode,
  global,
  graphics,
  GraphicType,
  sprite,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { buttonComponent } from "shared/components";
import { Size2d } from "shared/types";
import { TextureEnum } from "shared/enums";
import { __, isAuthDisabled, isDevelopment } from "shared/utils";
import { System } from "system";

export const offlineComponent: ContainerComponent = () => {
  const $container = container({});

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

  const renderBackground = (data?: Size2d) => {
    const { width, height } =
      data || global.getApplication().window.getBounds();
    $background.setRectangle(width, height);
  };
  global.events.on(Event.RESIZE, renderBackground);
  renderBackground();

  {
    const $card = container({
      position: {
        x: 300,
        y: 100,
      },
    });
    $container.add($card);

    const $human = sprite({
      texture: TextureEnum.HUMAN_DEV,
    });
    $human.setPivotX($human.getBounds().width);
    $human.setTint(0xefcfb1);

    const $title = textSprite({
      text: __("You have been disconnected from the server!"),
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0xffffff,
      position: {
        x: 0,
        y: 80,
      },
    });
    $title.setPivotX($title.getBounds().width / 2);

    const $button = buttonComponent({
      text: __("Return to the hotel"),
      width: 100,
      position: {
        x: 0,
        y: 100,
      },
      eventMode: EventMode.STATIC,
    });
    $button.setPivotX($button.getBounds().width / 2);

    if (isAuthDisabled()) {
      let timeout;
      const connect = async () => {
        try {
          await System.proxy.connect();
        } catch (e) {}
        timeout = setTimeout(connect, 1000);
      };

      $container.on(DisplayObjectEvent.DESTROYED, () => {
        clearTimeout(timeout);
      });
    }

    $button.on(DisplayObjectEvent.POINTER_TAP, () => {
      System.proxy.preConnect();
      if (isAuthDisabled()) System.proxy.connect();
    });

    $card.add($button, $title, $human);
  }

  return $container.getComponent(offlineComponent);
};
