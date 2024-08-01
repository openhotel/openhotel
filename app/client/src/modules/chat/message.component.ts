import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  HorizontalAlign,
  sliceSprite,
  textSprite,
} from "@tulib/tulip";
import { SpriteSheetEnum, TextureEnum } from "shared/enums";

type Mutable = {};

export const messageComponent: ContainerComponent<
  { username: string; color: number; message: string },
  Mutable
> = ({ username, color, message }) => {
  const $container = container<{}, Mutable>({
    sortableChildren: true,
  });

  const $text = textSprite({
    color: 0x000000,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: `${username}: ${message}`,
    position: {
      x: 8,
      y: 1,
    },
    horizontalAlign: HorizontalAlign.CENTER,
    pivot: { x: -5, y: -3 },
  });

  const bounds = $text.getBounds();
  const width = bounds.width + 32;
  const height = 13;

  const $bubbleBackground = sliceSprite({
    texture: TextureEnum.CHAT_BUBBLE_BACKGROUND,
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width,
    height,
    zIndex: -2,
  });
  $container.add($bubbleBackground);
  const $bubbleOver = sliceSprite({
    texture: TextureEnum.CHAT_BUBBLE_OVER,
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width,
    height,
    tint: color,
    zIndex: -1,
  });
  $container.add($bubbleOver);

  $container.add($text);

  return $container.getComponent(messageComponent);
};
