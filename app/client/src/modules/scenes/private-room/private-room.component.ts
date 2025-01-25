import {
  container,
  ContainerComponent,
  DisplayObjectEvent,
  Event as TulipEvent,
  EventMode,
  global,
} from "@tu/tulip";
import { bubbleChatComponent, systemMessageComponent } from "modules/chat";
import { previewComponent, roomComponent } from ".";
import { Size2d } from "shared/types";
import { hotBarChatComponent, roomInfoComponent } from "modules/interfaces";
import { System } from "system";
import { SystemEvent } from "shared/enums";
import {allowCameraPanning} from "../../../shared/utils/camera-panning.utils";

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
  const roomInfo = roomInfoComponent();
  $container.add(hotBar, roomInfo);

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

  let $roomScene = container({
    sortableChildren: true,
    eventMode: EventMode.STATIC,
  });
  const margin = 100;
  allowCameraPanning($roomScene, margin);
  $container.add($roomScene);

  const loadRoomPosition = () => {
    const size = global.getApplication().window.getBounds();
    const roomBounds = $room.getBounds();

    $room.setPosition({
      x: size.width / 2 - roomBounds.width / 2,
      y: size.height / 2 - roomBounds.height / 2,
    });

    $bubbleChat.setPositionX(0);
  };

  global.events.on(TulipEvent.RESIZE, loadRoomPosition);

  $container.on(DisplayObjectEvent.MOUNT, () => {
    if ($room) $roomScene.remove($room);
    $room = roomComponent();
    $roomScene.add($room);

    if ($bubbleChat) $roomScene.remove($bubbleChat);
    $bubbleChat = bubbleChatComponent({ room: $room });
    $roomScene.add($bubbleChat);
    loadRoomPosition();

    System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
  });

  return $container.getComponent(privateRoomComponent);
};
