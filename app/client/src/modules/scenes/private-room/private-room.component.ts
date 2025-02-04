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
import { Point2d, Size2d } from "shared/types";
import { hotBarChatComponent, roomInfoComponent } from "modules/interfaces";
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

export type PrivateRoomMutable = {
  getPosition: () => Point2d;
};

export const privateRoomComponent: ContainerComponent<
  {},
  PrivateRoomMutable
> = () => {
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

  let onRemoveResize;
  let onRemovePointerDown;
  let onRemovePointerMove;
  let onRemovePointerUp;
  let onRemoveEnableCamera;
  let onRemoveDisableCamera;

  $container.on(DisplayObjectEvent.MOUNT, () => {
    onRemoveResize = global.events.on(TulipEvent.RESIZE, loadRoomPosition);

    $roomScene.setPosition({ x: 0, y: 0 });
    if ($room) $roomScene.remove($room);
    $room = roomComponent();
    $roomScene.add($room);

    if ($bubbleChat) $roomScene.remove($bubbleChat);
    $bubbleChat = bubbleChatComponent({ room: $room });
    $roomScene.add($bubbleChat);
    loadRoomPosition();

    let isEnabled = true;
    const margin = 100;
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let containerStart = { x: 0, y: 0 };

    onRemoveEnableCamera = System.events.on(
      SystemEvent.ENABLE_CAMERA_MOVEMENT,
      () => {
        isEnabled = true;
      },
    );

    onRemoveDisableCamera = System.events.on(
      SystemEvent.DISABLE_CAMERA_MOVEMENT,
      () => {
        isEnabled = false;
      },
    );

    onRemovePointerDown = global.events.on(TulipEvent.POINTER_DOWN, (event) => {
      if (!isEnabled || event.button !== 0) return;
      isDragging = true;
      dragStart = { x: event.x, y: event.y };

      containerStart = $roomScene.getGlobalPosition();
    });

    onRemovePointerMove = global.events.on(TulipEvent.POINTER_MOVE, (event) => {
      if (!isDragging) return;

      const scale = global.window.getScale();
      const deltaX = (event.clientX - dragStart.x) / scale;
      const deltaY = (event.clientY - dragStart.y) / scale;

      let newX = Math.floor(containerStart.x + deltaX);
      let newY = Math.floor(containerStart.y + deltaY);

      const { width, height } = $roomScene.getBounds();

      const minX = -width / 2 + margin;
      const maxX = width / 2 - margin;
      const minY = -height / 2 + margin;
      const maxY = height / 2 - margin;

      $roomScene.setPosition({
        x: Math.max(minX, Math.min(newX, maxX)),
        y: Math.max(minY, Math.min(newY, maxY)),
      });
    });

    onRemovePointerUp = global.events.on(TulipEvent.POINTER_UP, (event) => {
      if (event.button !== 0) return;
      isDragging = false;
    });

    System.events.emit(SystemEvent.HIDE_NAVIGATOR_MODAL);
  });

  $container.on(DisplayObjectEvent.UNMOUNT, () => {
    onRemoveResize?.();

    onRemovePointerDown?.();
    onRemovePointerMove?.();
    onRemovePointerUp?.();
    onRemoveEnableCamera?.();
    onRemoveDisableCamera?.();
  });

  return $container.getComponent(privateRoomComponent, {
    getPosition: () => $roomScene.getPosition(),
  });
};
