import {
  container,
  ContainerComponent,
  HorizontalAlign,
  sliceSprite,
  textSprite,
  VerticalAlign,
} from "@tulib/tulip";
import { SpriteSheetEnum, TextureEnum } from "shared/enums";

export const typingBubbleComponent: ContainerComponent = async (props) => {
  const $container = await container({
    ...props,
    visible: false,
  });

  const width = 13;
  const height = 10;

  const $bubbleBackground = await sliceSprite({
    texture: TextureEnum.CHAT_ACTION_BACKGROUND,
    leftWidth: 8,
    topHeight: 3,
    rightWidth: 3,
    bottomHeight: 5,
    width,
    height,
  });
  const $bubbleOver = await sliceSprite({
    texture: TextureEnum.CHAT_ACTION_OVER,
    leftWidth: 8,
    topHeight: 3,
    rightWidth: 3,
    bottomHeight: 5,
    width,
    height,
    tint: 0x000000,
  });
  const $text = await textSprite({
    color: 0x000000,
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: "...",
    size: {
      width,
      height,
    },
    position: {
      x: 0,
      y: -1,
    },
    horizontalAlign: HorizontalAlign.CENTER,
    verticalAlign: VerticalAlign.MIDDLE,
  });
  $container.add($bubbleBackground, $bubbleOver, $text);

  return $container.getComponent(typingBubbleComponent);
};
