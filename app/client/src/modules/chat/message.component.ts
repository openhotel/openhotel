import {
  container,
  ContainerComponent,
  HorizontalAlign,
  sliceSprite,
  textSprite,
} from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";

type Mutable = {};

export const messageComponent: ContainerComponent<
  { username: string; color: number; message: string },
  Mutable
> = async ({ username, color, message }) => {
  const $container = await container<{}, Mutable>();

  const $text = await textSprite({
    color: 0x000000,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: `${username}: ${message}`,
    position: {
      x: 8,
      y: 1,
    },
    horizontalAlign: HorizontalAlign.CENTER,
  });

  const bounds = $text.getBounds();
  const width = bounds.width + 32;
  const height = 13;

  const $bubbleBackground = await sliceSprite({
    texture: "chat/bubble-background.png",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width,
    height,
  });
  const $bubbleOver = await sliceSprite({
    texture: "chat/bubble-over.png",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width,
    height,
    tint: color,
  });

  await $text.setPivot({ x: -5, y: -3 });

  $container.add($bubbleBackground, $bubbleOver, $text);

  return $container.getComponent(messageComponent);
};
