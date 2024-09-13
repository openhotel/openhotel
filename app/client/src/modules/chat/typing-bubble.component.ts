import {
  container,
  ContainerComponent,
  HorizontalAlign,
  nineSliceSprite,
  textSprite,
  VerticalAlign,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const typingBubbleComponent: ContainerComponent = (props) => {
  const $container = container({
    ...props,
    visible: false,
  });

  const width = 13;
  const height = 10;

  const $bubbleBackground = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "chat-writing-bg",
    leftWidth: 8,
    topHeight: 3,
    rightWidth: 3,
    bottomHeight: 5,
    width,
    height,
  });
  const $bubbleOver = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "chat-writing-border",
    leftWidth: 8,
    topHeight: 3,
    rightWidth: 3,
    bottomHeight: 5,
    width,
    height,
    tint: 0x000000,
  });
  const $text = textSprite({
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
