import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  graphics,
  GraphicType,
  textSprite,
} from "@tulib/tulip";
import { getRandomColor } from "../../../shared/utils";
import { SpriteSheetEnum } from "shared/enums";

type Mutable = {};

export const messageComponent: ContainerComponent<
  { username: string; message: string },
  Mutable
> = async ({ username, message }) => {
  const $container = await container<{}, Mutable>();

  const $text = await textSprite({
    color: getRandomColor(username),
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: `${username}: ${message}`,
  });

  const { width, height } = $text.$getFullSize();
  const boxWidth = width + 10;
  const boxHeight = height + 4;

  const $box = await graphics({
    type: GraphicType.RECTANGLE,
    width: boxWidth,
    height: boxHeight,
    color: 0xeeeeff,
  });

  await $text.setPivot({ x: -4, y: -3 });

  $container.add($box, $text);

  const jumpHeight = 30;
  const jumpInterval = 30;
  let timeElapsed = 0;

  $container.on(DisplayObjectEvent.TICK, ({ deltaTime }) => {
    const { y } = $container.getPosition();
    if (y < 0) {
      $container.$destroy();
      return;
    }

    timeElapsed += deltaTime;
    if (timeElapsed >= jumpInterval) {
      $container.setPositionY((y) => y - jumpHeight);
      timeElapsed = 0;
    }
  });

  return $container.getComponent(messageComponent);
};
