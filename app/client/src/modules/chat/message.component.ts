import {
  container,
  ContainerComponent,
  HorizontalAlign,
  sliceSprite,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum, TextureEnum } from "shared/enums";

type Mutable = {};

export const messageComponent: ContainerComponent<
  { username: string; color: number; message: string },
  Mutable
> = ({ username, color, message }) => {
  const $container = container<{}, Mutable>({
    sortableChildren: true,
  });

  const $username = textSprite({
    color: 0x000000,
    spriteSheet: SpriteSheetEnum.BOLD_FONT,
    text: `${username}: `,
    position: {
      x: 8,
      y: 1,
    },
    horizontalAlign: HorizontalAlign.CENTER,
    pivot: { x: -5, y: -3 },
  });
  const boundsName = $username.getBounds();

  const $message = textSprite({
    color: 0x000000,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: message,
    position: {
      x: 8 + boundsName.width,
      y: 1,
    },
    horizontalAlign: HorizontalAlign.CENTER,
    pivot: { x: -5, y: -3 },
    accentYCorrection: -2,
  });
  const boundsMessage = $message.getBounds();

  const width = boundsName.width + boundsMessage.width + 32;
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

  $container.add($username, $message);

  return $container.getComponent(messageComponent);
};
