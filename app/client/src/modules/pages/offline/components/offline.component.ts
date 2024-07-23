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
} from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";
import { buttonComponent } from "shared/components";
import { Size } from "shared/types";

type Props = {
  reconnect: () => {};
};

export const offlineComponent: ContainerComponent<Props> = async ({
  reconnect,
}) => {
  const $container = await container({});

  const $background = await graphics({
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

  const renderBackground = (data?: Size) => {
    const { width, height } =
      data || global.getApplication().window.getBounds();
    $background.setRectangle(width, height);
  };
  global.events.on(Event.RESIZE, renderBackground);
  renderBackground();

  {
    const $card = await container({
      position: {
        x: 300,
        y: 100,
      },
    });
    $container.add($card);

    const $human = await sprite({
      texture: "human_dev.png",
    });
    await $human.setPivotX($human.getBounds().width);
    await $human.setTint(0xefcfb1);

    const $title = await textSprite({
      text: "You have been disconnected from the server!",
      spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
      color: 0xffffff,
      position: {
        x: 0,
        y: 80,
      },
    });
    await $title.setPivotX($title.getBounds().width / 2);

    const $button = await buttonComponent({
      text: "Return to the hotel",
      width: 100,
      position: {
        x: 0,
        y: 100,
      },
      eventMode: EventMode.STATIC,
    });
    await $button.setPivotX($button.getBounds().width / 2);

    $button.on(DisplayObjectEvent.POINTER_TAP, () => {
      reconnect();
    });

    $card.add($button, $title, $human);
  }

  return $container.getComponent(offlineComponent);
};
