import {
  container,
  ContainerComponent,
  HorizontalAlign,
  nineSliceSprite,
  textSprite,
} from "@tu/tulip";
import { SpriteSheetEnum } from "shared/enums";

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

  let width =  Math.round(boundsName.width +boundsMessage.width + 32);
  const height = 13;
  
  //prevent odd widths that cannot be divided by 2
  if(width % 2 === 0) width++;

  const $bubbleBackground = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "circle-3",
    leftWidth: 6,
    topHeight: 6,
    rightWidth: 6,
    bottomHeight: 6,
    width,
    height,
    zIndex: -2,
  });
  $container.add($bubbleBackground);
  const $bubbleOver = nineSliceSprite({
    spriteSheet: SpriteSheetEnum.UI,
    texture: "circle-border-3",
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
