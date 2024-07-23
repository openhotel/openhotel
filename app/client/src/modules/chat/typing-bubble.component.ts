import {
  container,
  ContainerComponent,
  HorizontalAlign,
  sliceSprite,
  textSprite,
  VerticalAlign,
} from "@tulib/tulip";
import { SpriteSheetEnum } from "shared/enums";

export const typingBubbleComponent: ContainerComponent = async () => {
  const $container = await container({
    visible: false,
  });

  const height = 14;
  const width = 20;

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
    horizontalAlign: HorizontalAlign.CENTER,
    verticalAlign: VerticalAlign.MIDDLE,
  });
  $container.add($bubbleBackground, $bubbleOver, $text);

  return $container.getComponent(typingBubbleComponent);
};
