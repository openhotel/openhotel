import {
  container,
  ContainerComponent,
  textSprite,
  sliceSprite,
} from "@tulib/tulip";
import { getRandomPastelColor } from "../../shared/utils";
import { SpriteSheetEnum } from "shared/enums";

type Mutable = {};

export const messageComponent: ContainerComponent<
  { username: string; message: string },
  Mutable
> = async ({ username, message }) => {
  const $container = await container<{}, Mutable>();

  const $text = await textSprite({
    color: 0x000000,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: `${username}: ${message}`,
  });

  const { width, height } = $text.getBounds();
  const boxWidth = width + 10;
  const boxHeight = height + 4;

  const $bubble = await sliceSprite({
    texture: "bubble-chat.png",
    leftWidth: 3,
    topHeight: 3,
    rightWidth: 3,
    bottomHeight: 3,
    width: boxWidth,
    height: boxHeight,
  });

  await $bubble.setTint(getRandomPastelColor());

  await $text.setPivot({ x: -5, y: -3 });

  $container.add($bubble, $text);

  return $container.getComponent(messageComponent);
};
