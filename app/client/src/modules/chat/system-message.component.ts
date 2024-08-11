import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  HorizontalAlign,
  textSprite,
} from "@tu/tulip";
import { Event, SpriteSheetEnum } from "shared/enums";
import { System } from "system";
import { SystemMessageEvent } from "shared/types";

export const systemMessageComponent: ContainerComponent = ({ position }) => {
  const $container = container({
    sortableChildren: true,
    position,
    visible: false,
  });

  const $title = textSprite({
    spriteSheet: SpriteSheetEnum.BOLD_FONT,
    text: "> ",
    horizontalAlign: HorizontalAlign.CENTER,
    pivot: { x: -5, y: -3 },
  });
  const boundsName = $title.getBounds();

  const $message = textSprite({
    spriteSheet: SpriteSheetEnum.DEFAULT_FONT,
    text: "",
    position: {
      x: boundsName.width,
      y: 0,
    },
    horizontalAlign: HorizontalAlign.CENTER,
    pivot: { x: -5, y: -3 },
    accentYCorrection: -2,
  });

  $container.add($title, $message);

  let $typingTimeout: number;
  const onNewMessage = (message: string) => {
    $message.setText(message);
    $container.setVisible(true);

    clearTimeout($typingTimeout);
    $typingTimeout = setTimeout(() => {
      $container.setVisible(false);
    }, 5000);
  };

  const removeOnSystemMessage = System.proxy.on<SystemMessageEvent>(
    Event.SYSTEM_MESSAGE,
    ({ message }) => onNewMessage(message),
  );

  $container.on(DisplayObjectEvent.DESTROYED, () => {
    removeOnSystemMessage?.();
  });

  return $container.getComponent(systemMessageComponent);
};
