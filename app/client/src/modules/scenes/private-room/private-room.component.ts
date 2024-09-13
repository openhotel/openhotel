import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event as TulipEvent,
  global,
} from "@tu/tulip";
import { bubbleChatComponent, systemMessageComponent } from "modules/chat";
import { previewComponent, roomComponent } from ".";
import { Size2d } from "shared/types";
import { hotBarChatComponent } from "modules/interfaces";
import { System } from "system";
import { SystemEvent } from "shared/enums";

const CHAT_PADDING = {
  x: 12,
  y: 15,
};

const PREVIEW_PADDING = {
  x: 80,
  y: 180,
};

export const privateRoomComponent: ContainerComponent = () => {
  const $container = container({
    sortableChildren: true,
  });

  const windowBounds = global.getApplication().window.getBounds();

  const hotBar = hotBarChatComponent();
  $container.add(hotBar);

  const systemMessage = systemMessageComponent({
    position: {
      x: 0,
      y: windowBounds.height - CHAT_PADDING.y - 24,
    },
  });
  $container.add(systemMessage);

  const $preview = previewComponent({
    position: {
      x: windowBounds.width - PREVIEW_PADDING.x,
      y: windowBounds.height - PREVIEW_PADDING.y,
    },
  });
  $container.add($preview);

  global.events.on(TulipEvent.RESIZE, (size: Size2d) => {
    $preview.setPosition({
      x: size.width - PREVIEW_PADDING.x,
      y: size.height - PREVIEW_PADDING.y,
    });
  });

  let $room;
  let $bubbleChat;

  const loadRoomPosition = () => {
    const size = global.getApplication().window.getBounds();
    const roomBounds = $room.getBounds();

    $room.setPosition({
      x: size.width / 2 - roomBounds.width / 2,
      y: size.height / 2 - roomBounds.height / 2,
    });

    $bubbleChat.setPositionX(size.width / 2);
  };

  global.events.on(TulipEvent.RESIZE, loadRoomPosition);

  $container.on(DisplayObjectEvent.MOUNT, () => {
    if ($room) $container.remove($room);
    $room = roomComponent();
    $container.add($room);

    if ($bubbleChat) $container.remove($bubbleChat);
    $bubbleChat = bubbleChatComponent({ room: $room });
    $container.add($bubbleChat);
    loadRoomPosition();

    System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
  });

  return $container.getComponent(privateRoomComponent);
};
