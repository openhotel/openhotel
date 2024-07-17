import {
  container,
  ContainerComponent,
  Cursor,
  DisplayObjectEvent,
  EventMode,
  sprite,
  textSprite,
} from "@tulib/tulip";
import { SpriteSheetEnum } from "../../shared/enums";

type Props = {
  reconnect: () => {};
};

export const offlineScreenComponent: ContainerComponent<Props> = async ({
  reconnect,
}) => {
  const $container = await container();
  await $container.setPosition({ x: 300, y: 100 });

  const $human = await sprite({
    texture: "human_dev.png",
  });
  await $human.setPivotX($human.getBounds().width / 2);
  await $human.setTint(0xefcfb1);

  const $title = await textSprite({
    text: "Te has desconectado del servidor",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    position: {
      x: 0,
      y: 80,
    },
  });
  await $title.setPivotX($title.getBounds().width / 2);

  const $button = await textSprite({
    text: "Volver al hotel",
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    color: 0xffffff,
    backgroundPadding: [4, 4, 2, 4],
    backgroundColor: 0x1e1e1e,
    backgroundAlpha: 1,
    position: {
      x: 0,
      y: 100,
    },
    cursor: Cursor.POINTER,
    eventMode: EventMode.STATIC,
  });
  await $button.setPivotX($button.getBounds().width / 2);

  $button.on(DisplayObjectEvent.POINTER_DOWN, () => {
    reconnect();
  });

  $container.add($button, $title, $human);

  return $container.getComponent(offlineScreenComponent);
};
